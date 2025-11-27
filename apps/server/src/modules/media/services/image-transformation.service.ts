import { Inject, Injectable } from '@nestjs/common'

import { MediaModuleOptions } from '../types'
import { MEDIA_MODULE_OPTIONS } from '../tokens'
import { ImageTransformParameters, ImageTransformStrategy, NamingStrategy, StorageStrategy } from '../strategies'
import { EntityType, MediaType } from '../enums'

import { DatabaseService } from '@/modules/database'

@Injectable()
export class ImageTransformationService {
  private readonly imageTransformStrategy: ImageTransformStrategy
  private readonly imageTransformPresets: ImageTransformParameters[]
  private readonly storageStrategy: StorageStrategy
  private readonly namingStrategy: NamingStrategy

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly databaseService: DatabaseService,
  ) {
    this.imageTransformStrategy = this.options.imageTransformStrategy
    this.imageTransformPresets = this.options.imageTransformPresets
    this.storageStrategy = this.options.storageStrategy
    this.namingStrategy = this.options.namingStrategy
  }

  async transform(image: Buffer): Promise<string[]> {
    // Use to rollback the transaction if an error occurs
    const createdAssetPaths: string[] = []

    try {
      return this.databaseService.sql.begin(async (transaction) => {
        const assetIds: string[] = []

        for (const preset of this.imageTransformPresets) {
          const transformedImage = await this.imageTransformStrategy.transform(image, preset)

          // Create custom method for image naming with size
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

          const assetId = await transaction`
            INSERT INTO "media"."Asset" (
              "mediaType",
              "storageProvider",
              "storagePath",
              "publicUrl",
              "fileSize",
              "format"
            ) VALUES (
              ${MediaType.IMAGE},
              ${this.storageStrategy.name},
              ${storagePath},
              ${publicUrl},
              ${fileSize},
              ${preset.format}
            )
            RETURNING "id"
          `.then((result) => result.at(0)!.id as string)

          await transaction`
            INSERT INTO "media"."ImageMetadata" (
              "assetId",
              "width",
              "height",
              "dominantColor"
            ) VALUES (${assetId}, ${preset.width}, ${preset.height}, ${'aaa'})
          `

          assetIds.push(assetId)
        }

        return assetIds
      })
    } catch (error) {
      for (const path of createdAssetPaths) {
        await this.storageStrategy.delete(path)
      }

      throw error
    }
  }
}
