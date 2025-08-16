import { createReadStream, createWriteStream, existsSync, mkdirSync, readFile, unlink, writeFile } from 'fs'
import { dirname, join } from 'path'
import { promisify } from 'util'
import { Readable, Stream } from 'stream'

import { StorageStrategy } from './storage.strategy'
import { StorageProvider } from '../../enums'

const writeFileAsync = promisify(writeFile)
const unlinkAsync = promisify(unlink)
const readFileAsync = promisify(readFile)

export interface LocalStorageStrategyOptions {
  /**
   * The directory to store the media files in
   */
  directory: string
}

/**
 * Storage strategy that uses the local file system to store media files
 */
export class LocalStorageStrategy implements StorageStrategy {
  private readonly directory: string

  readonly storageProvider = StorageProvider.LOCAL

  constructor(private readonly options: LocalStorageStrategyOptions) {
    this.directory = options.directory
  }

  uploadFromBuffer(fileName: string, buffer: Buffer): Promise<string> {
    const filePath = join(this.directory, fileName)

    this.ensureDirectoryExists(filePath)

    return writeFileAsync(filePath, buffer).then(() => filePath)
  }

  uploadFromStream(fileName: string, stream: Stream): Promise<string> {
    const filePath = join(this.directory, fileName)

    this.ensureDirectoryExists(filePath)

    const writeStream = createWriteStream(filePath, 'binary')

    return new Promise<string>((resolve, reject) => {
      stream.pipe(writeStream)
      writeStream.on('close', () => resolve(filePath))
      writeStream.on('error', reject)
    })
  }

  downloadToBuffer(storagePath: string): Promise<Buffer> {
    return readFileAsync(storagePath)
  }

  downloadToStream(storagePath: string): Readable {
    return createReadStream(storagePath, 'binary')
  }

  async delete(storagePath: string): Promise<void> {
    try {
      await unlinkAsync(storagePath)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return
      }

      throw error
    }
  }

  /**
   * Ensures that the directory exists
   * @param path - The path to the file or directory
   */
  private ensureDirectoryExists(path: string): void {
    const folder = dirname(path)

    if (!existsSync(folder)) {
      mkdirSync(folder, { recursive: true })
    }
  }
}
