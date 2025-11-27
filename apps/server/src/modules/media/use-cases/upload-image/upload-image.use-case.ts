import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import { UploadImageValidator } from './upload-image.validator'
import { MediaModuleOptions } from '../../types'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { StorageStrategy } from '../../strategies/storage'
import {
  ImageAnalyzeStrategy,
  ImageTransformParameters,
  ImageTransformStrategy,
  NamingStrategy,
} from '../../strategies'
import { MediaType } from '../../enums'
import { AssetEntity } from '../../entities'

import { UseCase } from '@/modules/shared/interfaces'
import { DatabaseService } from '@/modules/database'

export interface UploadImageUseCaseParams {
  readonly file: Buffer
}

type UploadImageUseCaseResult = AssetEntity[]

@Injectable()
export class UploadImageUseCase implements UseCase<UploadImageUseCaseParams, UploadImageUseCaseResult> {
  private readonly storageStrategy: StorageStrategy
  private readonly imageTransformStrategy: ImageTransformStrategy
  private readonly imageTransformParameters: ImageTransformParameters[]
  private readonly imageAnalyzeStrategy: ImageAnalyzeStrategy
  private readonly namingStrategy: NamingStrategy

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly uploadImageValidator: UploadImageValidator,
    private readonly databaseService: DatabaseService,
  ) {
    this.storageStrategy = this.options.storageStrategy
    this.imageTransformStrategy = this.options.imageTransformStrategy
    this.imageTransformParameters = this.options.imageTransformPresets
    this.imageAnalyzeStrategy = this.options.imageAnalyzeStrategy
    this.namingStrategy = this.options.namingStrategy
  }

  async invoke(params: UploadImageUseCaseParams): Promise<UploadImageUseCaseResult> {
    const validationResult = await this.uploadImageValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const createdAssetPaths: string[] = []

    try {
      return this.databaseService.sql.begin(async (transaction) => {
        const assets: AssetEntity[] = []

        const dominantColor = await this.imageAnalyzeStrategy.getDominantColor(params.file)

        for (const preset of this.imageTransformParameters) {
          const transformedImage = await this.imageTransformStrategy.transform(params.file, preset)

          const fileName = this.namingStrategy.generateFileName({
            fileName: `${preset.width}x${preset.height}`,
            format: preset.format,
          })

          const storagePath = await this.storageStrategy.uploadFromBuffer(fileName, transformedImage)

          createdAssetPaths.push(storagePath)

          const fileSize = transformedImage.length
          /**
           * @todo Add public URL to naming strategy
           */
          const publicUrl = 'test'

          const asset = await transaction<AssetEntity[]>`
            INSERT INTO "media"."Asset" (
              "mediaType",
              "storageProvider",
              "storagePath",
              "publicUrl",
              "fileSize",
              "format"
            ) VALUES (${MediaType.IMAGE}, ${this.storageStrategy.name}, ${storagePath}, ${publicUrl}, ${fileSize}, ${preset.format})
            RETURNING *
          `.then((result) => result.at(0)!)

          await transaction`
            INSERT INTO "media"."ImageMetadata" (
              "assetId",
              "width",
              "height",
              "dominantColor"
            ) VALUES (${asset.id}, ${preset.width}, ${preset.height}, ${dominantColor})
          `

          assets.push(asset)
        }

        return assets
      })
    } catch (error) {
      for (const path of createdAssetPaths) {
        await this.storageStrategy.delete(path)
      }

      throw error
    }
  }
}
