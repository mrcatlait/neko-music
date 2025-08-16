import Stream, { Readable } from 'stream'

import { StorageProvider } from '../../enums'

/**
 * Storage strategy interface defines the methods that a storage strategy must implement
 */
export interface StorageStrategy {
  /**
   * The storage provider
   */
  readonly storageProvider: StorageProvider

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
   * Deletes a file from the storage
   * @param storagePath - The storage path of the file
   */
  delete(storagePath: string): Promise<void>
}
