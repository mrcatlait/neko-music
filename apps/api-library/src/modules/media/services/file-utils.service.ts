import { Injectable } from '@nestjs/common'
import { fileTypeFromBuffer } from 'file-type'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, unlinkSync, writeFileSync } from 'fs'
import { join } from 'path'

export interface SegmentInfo {
  segmentPaths: string[]
  totalSize: number
  segmentCount: number
  bitrateVariants: number
}

@Injectable()
export class FileUtilsService {
  /**
   * Create a directory if it does not exist
   * @param directory Path to the directory
   */
  createDirectory(directory: string): void {
    if (!existsSync(directory)) {
      mkdirSync(directory, { recursive: true })
    }
  }

  /**
   * Create a file if it does not exist
   * @param path Path to the file
   * @param content The content of the file
   */
  createFile(path: string, content: Buffer): void {
    writeFileSync(path, content)
  }

  /**
   * Get the file type from a buffer
   * @param buffer The buffer to get the file type from
   * @returns The file type
   */
  getFileTypeFromBuffer(buffer: Buffer): Promise<string | undefined> {
    return fileTypeFromBuffer(buffer).then((fileType) => fileType?.ext)
  }

  /**
   * Get the file type from a path
   * @param path The path to get the file type from
   * @returns The file type
   */
  getFileTypeFromPath(path: string): string | undefined {
    return path.split('.').pop()
  }

  /**
   * Get the list of files in a directory
   * @param directory Path to the directory
   * @returns The list of files in the directory
   */
  getFileList(directory: string): string[] {
    return readdirSync(directory).filter((file) => statSync(join(directory, file)).isFile())
  }

  /**
   * Get the size of a directory
   * @param directoryPath Path to the directory
   * @returns The size of the directory in bytes
   */
  getDirectorySize(directoryPath: string): number {
    const files = readdirSync(directoryPath)
    return files.reduce((total, file) => total + statSync(join(directoryPath, file)).size, 0)
  }

  /**
   * Delete a directory
   * @param directory Path to the directory
   */
  deleteDirectory(directory: string): void {
    rmSync(directory, { recursive: true })
  }

  /**
   * Delete a file
   * @param path Path to the file
   */
  deleteFile(path: string): void {
    unlinkSync(path)
  }

  /**
   * Read a file from a path
   * @param path Path to the file
   * @returns The file content
   */
  readFile(path: string): Buffer {
    return readFileSync(path)
  }

  /**
   * Read a file from a path
   * @param path Path to the file
   * @returns The file content
   */
  readFileSync(path: string): string {
    return readFileSync(path, 'utf8')
  }
}
