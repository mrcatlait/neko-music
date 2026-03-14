import {
  copyFileSync,
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFile,
  rmdir,
  unlink,
  writeFile,
} from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { promisify } from 'node:util'
import { Readable, Stream } from 'node:stream'

import { StorageStrategy } from './storage.strategy'
import { StorageProvider } from '../../enums'

const writeFileAsync = promisify(writeFile)
const unlinkAsync = promisify(unlink)
const readFileAsync = promisify(readFile)
const rmdirAsync = promisify(rmdir)

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

  readonly name = StorageProvider.Local

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

    return new Promise<string>((resolvePromise, reject) => {
      stream.pipe(writeStream)
      writeStream.on('close', () => resolvePromise(filePath))
      writeStream.on('error', reject)
    })
  }

  downloadToBuffer(storagePath: string): Promise<Buffer> {
    return readFileAsync(storagePath)
  }

  downloadToStream(storagePath: string): Readable {
    return createReadStream(storagePath, 'binary')
  }

  downloadToFile(storagePath: string, localFilePath: string): Promise<void> {
    copyFileSync(storagePath, localFilePath)

    return Promise.resolve()
  }

  async delete(storagePath: string): Promise<void> {
    try {
      await unlinkAsync(storagePath)
      await this.removeEmptyParentDirectories(storagePath)
    } catch (error) {
      // File not found
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return
      }

      throw error
    }
  }

  /**
   * Removes empty parent directories after a file is deleted.
   * Stops at the storage root directory.
   * Uses rmdir directly (no readdir) to avoid issues with hidden files (.DS_Store, Thumbs.db).
   */
  private async removeEmptyParentDirectories(filePath: string): Promise<void> {
    const root = resolve(this.directory)
    let dir = resolve(dirname(filePath))

    while (this.isWithinRoot(root, dir)) {
      try {
        await rmdirAsync(dir)
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code
        if (code === 'ENOTEMPTY' || code === 'ENOENT') break
        throw error
      }
      dir = resolve(dirname(dir))
    }
  }

  private isWithinRoot(root: string, dir: string): boolean {
    const rel = relative(root, dir)
    return rel.length > 0 && !rel.startsWith('..') && !rel.includes('..' + sep)
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
