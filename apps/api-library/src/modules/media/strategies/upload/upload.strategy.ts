import { File } from '@nest-lab/fastify-multer'
import { createHash, randomUUID } from 'crypto'
import { BadRequestException } from '@nestjs/common'

import { StorageStrategyRegistry } from '../storage'
import { getFileExtension } from '../../utils'
import { StorageProvider } from '../../enums'

export interface MediaUploadOptions {
  entityId: string
  file: File
}

export interface RecordInDatabaseOptions {
  entityId: string
  fileName: string
  fileExtension: string
  fileSize: number
  storagePath: string
  storageProvider: StorageProvider
  publicUrl: string
}

export abstract class UploadStrategy {
  constructor(private readonly storageStrategyRegistry: StorageStrategyRegistry) {}

  async upload(options: MediaUploadOptions): Promise<void> {
    const storageStrategy = this.storageStrategyRegistry.getStrategy()

    if (!options.file.buffer || !options.file.size) {
      throw new BadRequestException('File is required')
    }

    const fileExtension = getFileExtension(options.file.originalname)

    const fileName = `${randomUUID()}.${fileExtension}`

    const { storagePath, storageProvider, publicUrl } = await storageStrategy.upload({
      content: options.file.buffer,
      fileName,
    })

    try {
      await this.recordInDatabase({
        entityId: options.entityId,
        fileName,
        fileExtension,
        fileSize: options.file.size,
        storagePath,
        storageProvider,
        publicUrl,
      })
    } catch (error) {
      await storageStrategy.delete({
        fileName,
      })

      throw error
    }
  }

  protected abstract recordInDatabase(options: RecordInDatabaseOptions): Promise<void>
}
