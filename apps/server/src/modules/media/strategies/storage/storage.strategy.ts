import Stream, { Readable } from 'node:stream'

import { StorageProvider } from '../../enums'

/**
 * Storage strategy interface defines the methods that a storage strategy must implement
 */
export interface StorageStrategy {
  /**
   * The storage provider
   */
  readonly name: StorageProvider

  /**
   * Uploads a buffer to the storage
   * @param fileName - The name of the file
   * @param buffer - The buffer to upload
   * @returns The storage path of the uploaded file
   */
  uploadFromBuffer(fileName: string, buffer: Buffer): Promise<string>

  /**
   * Uploads a stream to the storage
   * @param fileName - The name of the file
   * @param stream - The stream to upload
   * @returns The storage path of the uploaded file
   */
  uploadFromStream(fileName: string, stream: Stream): Promise<string>

  /**
   * Uploads a file to the storage
   * @param fileName - The name of the file
   * @param sourcePath - The path of the file to upload
   * @returns The storage path of the uploaded file
   */
  uploadFromFile(fileName: string, sourcePath: string): Promise<string>

  /**
   * Downloads a file from the storage to a buffer
   * @param storagePath - The storage path of the file
   * @returns The buffer of the downloaded file
   */
  downloadToBuffer(storagePath: string): Promise<Buffer>

  /**
   * Downloads a file from the storage to a stream
   * @param storagePath - The storage path of the file
   * @returns The stream of the downloaded file
   */
  downloadToStream(storagePath: string): Readable

  /**
   * Downloads a file from the storage to a local file
   * @param storagePath - The storage path of the file
   * @param localFilePath - The local file path to download the file to
   * @returns The local file path of the downloaded file
   */
  downloadToFile(storagePath: string, localFilePath: string): Promise<void>

  /**
   * Deletes a file from the storage
   * @param storagePath - The storage path of the file
   */
  delete(storagePath: string): Promise<void>
}
