import { Injectable } from '@nestjs/common'
import { fileTypeFromBuffer } from 'file-type'
import { createHash } from 'node:crypto'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

@Injectable()
export class FileService {
  /**
   * Get the file type from a buffer
   * @param buffer - The buffer to get the file type from
   * @returns The file type or throws an error if the file type is not found
   */
  getFileTypeFromBuffer(buffer: Buffer): Promise<string> {
    return fileTypeFromBuffer(buffer).then((fileType) => {
      const format = fileType?.ext

      if (!format) {
        throw new Error('Failed to get file type from buffer')
      }

      return format
    })
  }

  /**
   * Compute the SHA-256 checksum from a buffer
   * @param buffer The buffer to compute the checksum from
   * @returns The SHA-256 checksum
   */
  computeChecksumFromBuffer(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex')
  }

  /**
   * Get the size of a directory
   * @param directoryPath - The path to the directory
   * @returns The size of the directory in bytes
   */
  getDirectorySize(directoryPath: string): number {
    const files = readdirSync(directoryPath)
    return files.reduce((total, file) => total + statSync(join(directoryPath, file)).size, 0)
  }
}
