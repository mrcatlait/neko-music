import { Injectable, Logger } from '@nestjs/common'
import { join } from 'path'
import { readFileSync } from 'fs'

import { getFileName } from '../../utils'
import { ARTWORK_RESOLUTIONS, TEMP_PATH } from '../../constants'
import { ArtworkSize, ProcessingStatus, StorageProvider } from '../../enums'
import { ArtistArtworkRepository, ArtistArtworkVariantRepository } from '../../repositories'
import { ProcessingStrategy } from './processing.strategy'
import { MediaStorageStrategy, StorageStrategyRegistry } from '../storage'
import { ImageProcessingService } from '../../services'

import { ArtistArtworkVariantEntity } from '@modules/media/entities'

@Injectable()
export class ArtistArtworkProcessingStrategy implements ProcessingStrategy {
  private readonly logger = new Logger(this.constructor.name)
  private readonly sizesToCreate = [ArtworkSize.SMALL, ArtworkSize.MEDIUM, ArtworkSize.LARGE]
  private readonly localStorage: MediaStorageStrategy

  constructor(
    private readonly repository: ArtistArtworkRepository,
    private readonly variantRepository: ArtistArtworkVariantRepository,
    private readonly storageStrategyRegistry: StorageStrategyRegistry,
    private readonly imageProcessingService: ImageProcessingService,
  ) {
    this.localStorage = this.storageStrategyRegistry.getStrategy(StorageProvider.LOCAL)
  }

  async process(): Promise<void> {
    const pendingArtistArtworks = await this.repository.findByProcessingStatus(ProcessingStatus.PENDING)

    if (pendingArtistArtworks.length === 0) {
      this.logger.debug('No pending artist artworks found')
      return
    }

    const firstPendingArtistArtwork = pendingArtistArtworks[0]

    const originalVariant = await this.variantRepository.findByArtworkIdAndSize(
      firstPendingArtistArtwork.id,
      ArtworkSize.ORIGINAL,
    )

    if (!originalVariant) {
      throw new Error('Original variant not found')
    }

    const originalFilePath = join(TEMP_PATH, getFileName(originalVariant.storagePath))

    console.log('originalFilePath', originalFilePath)

    try {
      await this.downloadOriginalVariant(originalVariant, originalFilePath)

      const primaryColor = await this.imageProcessingService.getPrimaryColor(originalFilePath)

      try {
        await Promise.all(
          this.sizesToCreate.map((size) => this.generateVariant(originalFilePath, firstPendingArtistArtwork.id, size)),
        )

        await this.repository.update({
          ...firstPendingArtistArtwork,
          backgroundColor: primaryColor,
          processingStatus: ProcessingStatus.COMPLETED,
        })

        this.logger.debug('Artist artwork processed successfully')
      } finally {
        await this.localStorage.delete({
          fileName: originalFilePath,
        })
      }
    } catch (error) {
      this.logger.error('Artist artwork processing failed', error)

      await this.repository.update({
        ...firstPendingArtistArtwork,
        processingStatus: ProcessingStatus.FAILED,
        processingError: error instanceof Error ? error.message : 'Unknown error',
        processingAttempts: firstPendingArtistArtwork.processingAttempts + 1,
      })
    } finally {
      await this.localStorage.delete({
        fileName: originalFilePath,
      })
    }
  }

  async downloadOriginalVariant(originalVariant: ArtistArtworkVariantEntity, targetPath: string): Promise<void> {
    const storage = this.storageStrategyRegistry.getStrategy(originalVariant.storageProvider)

    await storage.download({
      storagePath: originalVariant.storagePath,
      targetPath,
    })
  }

  async generateVariant(originalFilePath: string, artworkId: string, size: ArtworkSize): Promise<void> {
    const originalFileName = getFileName(originalFilePath)
    const originalFileNameWithoutExtension = originalFileName.split('.').at(0)

    if (!originalFileNameWithoutExtension) {
      throw new Error('Original file name without extension not found')
    }

    const fileName = `${originalFileNameWithoutExtension}-${size}.webp`
    const filePath = join(TEMP_PATH, fileName)

    await this.imageProcessingService.createWebpImage({
      width: ARTWORK_RESOLUTIONS[size].width,
      height: ARTWORK_RESOLUTIONS[size].height,
      sourcePath: originalFilePath,
      targetPath: join(TEMP_PATH, fileName),
    })

    const currentActiveStorage = this.storageStrategyRegistry.getStrategy()

    try {
      const storageInfo = await currentActiveStorage.upload({
        content: readFileSync(filePath),
        fileName,
      })

      await this.variantRepository.create({
        size,
        artistArtworkId: artworkId,
        format: 'webp',
        fileSize: storageInfo.fileSize,
        publicUrl: storageInfo.publicUrl,
        storageProvider: storageInfo.storageProvider,
        storagePath: storageInfo.storagePath,
      })
    } finally {
      await this.localStorage.delete({
        fileName: filePath,
      })
    }
  }
}
