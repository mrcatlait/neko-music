import { Inject, Injectable } from '@nestjs/common'

import { AssetRepository, ImageMetadataRepository, SourceAssetRepository } from '../repositories'
import { MEDIA_MODULE_OPTIONS } from '../tokens'
import { MediaModuleOptions } from '../types'
import { ImageSize } from '../enums'
import {
  ImageAnalyzeStrategy,
  ImageTransformPresets,
  ImageTransformStrategy,
  NamingStrategy,
  StorageStrategy,
} from '../strategies'
import { FileService } from './file.service'

@Injectable()
export class ImageService {
  private readonly imageTransformStrategy: ImageTransformStrategy
  private readonly imageTransformPresets: ImageTransformPresets
  private readonly imageAnalyzeStrategy: ImageAnalyzeStrategy
  private readonly storageStrategy: StorageStrategy
  private readonly namingStrategy: NamingStrategy

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly assetRepository: AssetRepository,
    private readonly sourceAssetRepository: SourceAssetRepository,
    private readonly imageMetadataRepository: ImageMetadataRepository,
    private readonly fileService: FileService,
  ) {
    this.imageTransformStrategy = options.imageTransformStrategy
    this.imageTransformPresets = options.imageTransformPresets
    this.imageAnalyzeStrategy = options.imageAnalyzeStrategy
    this.storageStrategy = options.storageStrategy
    this.namingStrategy = options.namingStrategy
  }

  async transform(sourceAssetId: string): Promise<void> {
    const source = await this.sourceAssetRepository.findById(sourceAssetId)

    if (!source) {
      throw new Error(`Media source with id "${sourceAssetId}" not found`)
    }

    const sourceImage = await this.storageStrategy.downloadToBuffer(source.storagePath)

    const dominantColor = await this.imageAnalyzeStrategy.getDominantColor(sourceImage)

    const sourceFileName = this.fileService.extractFilenameFromPath(source.storagePath)

    const created: Record<string, { storagePath: string; assetId?: string }> = {}
    const format = this.imageTransformPresets.format

    try {
      for (const presetName of Object.values(ImageSize)) {
        const preset = this.imageTransformPresets[presetName]
        const transformedImage = await this.imageTransformStrategy.transform(sourceImage, format, preset)

        const fileName = this.namingStrategy.generateArtworkFilename(sourceFileName, presetName, format)

        const fileSize = transformedImage.length
        const storagePath = await this.storageStrategy.uploadFromBuffer(fileName, transformedImage)

        created[presetName] = { storagePath }

        const asset = await this.assetRepository.create({
          sourceAssetId: source.id,
          mediaType: source.mediaType,
          entityType: source.entityType,
          entityId: source.entityId,
          storageProvider: this.storageStrategy.name,
          storagePath,
          fileSize,
          format,
        })

        await this.imageMetadataRepository.create({
          assetId: asset.id,
          width: preset.width,
          height: preset.height,
          dominantColor,
        })

        created[presetName].assetId = asset.id
      }
    } catch (error) {
      for (const presetName of Object.keys(created)) {
        const createdAsset = created[presetName]

        await this.storageStrategy.delete(createdAsset.storagePath)

        if (createdAsset.assetId) {
          await this.imageMetadataRepository.deleteByAssetId(createdAsset.assetId)
          await this.assetRepository.deleteById(createdAsset.assetId)
        }
      }

      throw error
    }
  }
}
