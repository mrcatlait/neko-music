import { File } from '@nest-lab/fastify-multer'
import { createHash, randomUUID } from 'crypto'
import { BadRequestException } from '@nestjs/common'

import { StorageStrategyRegistry } from '../storage'

import { StorageProvider } from '@modules/media/enums'

export interface MediaUploadOptions {
  entityId: string
  file: File
}

export interface RecordInDatabaseOptions {
  entityId: string
  fileHash: string
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

    const fileHash = createHash('sha256').update(options.file.buffer).digest('hex')

    const hasMatchingHash = await this.hasMatchingHash(fileHash)

    if (hasMatchingHash) {
      throw new BadRequestException('File already exists')
    }

    const fileExtension = options.file.originalname.split('.').pop()

    if (!fileExtension) {
      throw new BadRequestException('Invalid file extension')
    }

    const fileName = `${randomUUID()}.${fileExtension}`

    const { storagePath, storageProvider, publicUrl } = await storageStrategy.upload({
      file: options.file,
      fileName,
    })

    try {
      await this.recordInDatabase({
        entityId: options.entityId,
        fileHash,
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

  protected abstract hasMatchingHash(fileHash: string): Promise<boolean>

  protected abstract recordInDatabase(options: RecordInDatabaseOptions): Promise<void>
}
