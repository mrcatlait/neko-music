import { Injectable, Inject } from '@nestjs/common'
import Stream, { Readable } from 'stream'

import { StorageProvider } from '../enums'
import { StorageStrategy } from '../strategies'
import { MEDIA_MODULE_OPTIONS } from '../tokens'
import { MediaModuleOptions } from '../types'

@Injectable()
export class StorageService {
  private readonly storageStrategy: StorageStrategy

  constructor(@Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions) {
    this.storageStrategy = this.options.storageStrategy
  }

  /**
   * Get the storage provider type
   */
  get provider(): StorageProvider {
    return this.storageStrategy.storageProvider
  }

  /**
   * Upload a file from buffer
   */
  async uploadBuffer(fileName: string, buffer: Buffer): Promise<string> {
    return this.storageStrategy.uploadFromBuffer(fileName, buffer)
  }

  /**
   * Upload a file from stream
   */
  async uploadStream(fileName: string, stream: Stream): Promise<string> {
    return this.storageStrategy.uploadFromStream(fileName, stream)
  }

  /**
   * Download a file as buffer
   */
  async downloadToBuffer(storagePath: string): Promise<Buffer> {
    return this.storageStrategy.downloadToBuffer(storagePath)
  }

  /**
   * Download a file as stream
   */
  downloadToStream(storagePath: string): Readable {
    return this.storageStrategy.downloadToStream(storagePath)
  }

  /**
   * Delete a file
   */
  async deleteFile(storagePath: string): Promise<void> {
    return this.storageStrategy.delete(storagePath)
  }

  /**
   * Upload multiple files from buffers (for batch operations)
   */
  async uploadMultipleBuffers(files: Array<{ fileName: string; buffer: Buffer }>): Promise<string[]> {
    return Promise.all(files.map((file) => this.uploadBuffer(file.fileName, file.buffer)))
  }

  /**
   * Delete multiple files (with error handling for individual failures)
   */
  async deleteMultipleFiles(storagePaths: string[]): Promise<void> {
    const deletePromises = storagePaths.map(async (path) => {
      try {
        await this.deleteFile(path)
      } catch (error) {
        // Log error but don't fail the entire operation
        console.warn(`Failed to delete file ${path}:`, error)
      }
    })

    await Promise.allSettled(deletePromises)
  }
}
