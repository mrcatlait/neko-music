import { Injectable, Logger } from '@nestjs/common'
import { copyFile, existsSync, mkdirSync, unlink, writeFile } from 'fs'
import { dirname, join } from 'path'
import { promisify } from 'util'

import {
  MediaDeleteOptions,
  MediaDownloadOptions,
  MediaStorageStrategy,
  MediaUploadOptions,
  MediaUploadResult,
} from './storage.strategy'
import { StorageProvider } from '../../enums'
import { MEDIA_PATH } from '../../constants'

const writeFileAsync = promisify(writeFile)
const unlinkAsync = promisify(unlink)
const copyFileAsync = promisify(copyFile)

@Injectable()
export class LocalStorageStrategy implements MediaStorageStrategy {
  private readonly logger = new Logger(LocalStorageStrategy.name)

  async upload(options: MediaUploadOptions): Promise<MediaUploadResult> {
    try {
      const filePath = join(MEDIA_PATH, options.fileName)
      const folder = dirname(filePath)

      if (!existsSync(folder)) {
        mkdirSync(folder, { recursive: true })
        this.logger.debug(`Created directory: ${folder}`)
      }

      await writeFileAsync(filePath, options.content)
      this.logger.debug(`File uploaded successfully: ${filePath}`)

      return {
        storageProvider: StorageProvider.LOCAL,
        storagePath: filePath,
        publicUrl: `/media/${options.fileName}`,
        fileSize: options.content.length,
      }
    } catch (error) {
      this.logger.error(`Failed to upload file: ${options.fileName}`, error)
      throw new Error(`Local storage upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  download(options: MediaDownloadOptions): Promise<void> {
    const folder = dirname(options.targetPath)

    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true })
      this.logger.debug(`Created directory: ${folder}`)
    }

    return copyFileAsync(options.storagePath, options.targetPath)
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
