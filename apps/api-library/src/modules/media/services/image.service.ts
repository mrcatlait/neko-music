import { Inject, Injectable } from '@nestjs/common'

import { MediaModuleOptions } from '../types'
import { MEDIA_MODULE_OPTIONS } from '../tokens'
import {
  ImageAnalyzeStrategy,
  ImageTransformParameters,
  ImageTransformStrategy,
  NamingStrategy,
  StorageStrategy,
} from '../strategies'
import { MediaAssetRepository, MediaImageMetadataRepository, MediaSourceRepository } from '../repositories'
import { MediaType } from '../enums'

import { DatabaseService } from '@/modules/database'

/**
 * @todo Split into multiple services or sagas
 */
@Injectable()
export class ImageService {
  private readonly imageTransformStrategy: ImageTransformStrategy
  private readonly imageTransformPresets: ImageTransformParameters[]
  private readonly storageStrategy: StorageStrategy
  private readonly namingStrategy: NamingStrategy
  private readonly imageAnalyzeStrategy: ImageAnalyzeStrategy

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly databaseService: DatabaseService,
    private readonly mediaSourceRepository: MediaSourceRepository,
    private readonly mediaAssetRepository: MediaAssetRepository,
    private readonly mediaImageMetadataRepository: MediaImageMetadataRepository,
  ) {
    this.imageTransformStrategy = this.options.imageTransformStrategy
    this.imageTransformPresets = this.options.imageTransformPresets
    this.storageStrategy = this.options.storageStrategy
    this.namingStrategy = this.options.namingStrategy
    this.imageAnalyzeStrategy = this.options.imageAnalyzeStrategy
  }

  async transform(sourceId: string): Promise<void> {
    const source = await this.mediaSourceRepository.findOne(sourceId)

    if (!source) {
      throw new Error('Media source not found')
    }

    const image = await this.storageStrategy.downloadToBuffer(source.storagePath)

    // Use to rollback the transaction if an error occurs
    const createdAssetPaths: string[] = []

    try {
      await this.databaseService.sql.begin(async (transaction) => {
        for (const preset of this.imageTransformPresets) {
          const result = await this.imageTransformStrategy.transform(image, preset)

          const fileName = this.namingStrategy.generateFileName(
            `${preset.width}x${preset.height}.${preset.format}`,
            source.entityId,
          )

          const storagePath = await this.storageStrategy.uploadFromBuffer(fileName, result)
          createdAssetPaths.push(storagePath)

          const fileSize = result.length
          /**
           * @todo Add public URL to naming strategy
           */
          const publicUrl = 'test'

          const asset = await this.mediaAssetRepository.create(
            {
              entityType: source.entityType,
              entityId: source.entityId,
              sourceId: source.id,
              storageProvider: this.storageStrategy.storageProvider,
              storagePath,
              mediaType: MediaType.ARTWORK,
              publicUrl,
              fileSize,
              format: preset.format,
            },
            transaction,
          )

          await this.mediaImageMetadataRepository.create(
            {
              assetId: asset.id,
              width: preset.width,
              height: preset.height,
              dominantColor: '',
            },
            transaction,
          )
        }
      })
    } catch (error) {
      for (const path of createdAssetPaths) {
        await this.storageStrategy.delete(path)
      }

      throw error
    }
  }

  async analyze(sourceId: string): Promise<void> {
    const source = await this.mediaSourceRepository.findOne(sourceId)

    if (!source) {
      throw new Error('Media source not found')
    }

    const assets = await this.mediaAssetRepository.findManyBySourceId(source.id)

    if (assets.length === 0) {
      return
    }

    const image = await this.storageStrategy.downloadToBuffer(source.storagePath)
    const dominantColor = await this.imageAnalyzeStrategy.getDominantColor(image)

    for (const asset of assets) {
      const metadata = await this.mediaImageMetadataRepository.findOne(asset.id)

      if (!metadata) {
        throw new Error('Media image metadata not found')
      }

      await this.mediaImageMetadataRepository.update({
        ...metadata,
        dominantColor,
      })
    }
  }
}
