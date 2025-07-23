import { Injectable, Logger } from '@nestjs/common'
import { existsSync, mkdirSync, unlink, writeFile } from 'fs'
import { dirname } from 'path'
import { promisify } from 'util'

import { MediaDeleteOptions, MediaStorageStrategy, MediaUploadOptions, MediaUploadResult } from './storage.strategy'

import { StorageProvider } from '@modules/media/enums'

const writeFileAsync = promisify(writeFile)
const unlinkAsync = promisify(unlink)

@Injectable()
export class LocalStorageStrategy implements MediaStorageStrategy {
  private readonly logger = new Logger(LocalStorageStrategy.name)

  async upload(options: MediaUploadOptions): Promise<MediaUploadResult> {
    try {
      if (!options.file.buffer) {
        throw new Error('File buffer is required')
      }

      const folder = dirname(options.fileName)

      if (!existsSync(folder)) {
        mkdirSync(folder, { recursive: true })
        this.logger.debug(`Created directory: ${folder}`)
      }

      await writeFileAsync(options.fileName, options.file.buffer)
      this.logger.debug(`File uploaded successfully: ${options.fileName}`)

      return {
        storageProvider: StorageProvider.LOCAL,
        storagePath: options.fileName,
        publicUrl: `/media/${options.fileName}`,
      }
    } catch (error) {
      this.logger.error(`Failed to upload file: ${options.fileName}`, error)
      throw new Error(`Local storage upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async delete(options: MediaDeleteOptions): Promise<void> {
    try {
      await unlinkAsync(options.fileName)
      this.logger.debug(`File deleted successfully: ${options.fileName}`)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        this.logger.warn(`File not found for deletion: ${options.fileName}`)
        return
      }

      this.logger.error(`Failed to delete file: ${options.fileName}`, error)
      throw new Error(`Local storage deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
