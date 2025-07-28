import { StorageProvider } from '@modules/media/enums'

export interface MediaUploadOptions {
  content: Buffer
  fileName: string
}

export interface MediaUploadResult {
  storageProvider: StorageProvider
  storagePath: string
  publicUrl: string
  fileSize: number
}

export interface MediaDownloadOptions {
  storagePath: string
  targetPath: string
}

export interface MediaDeleteOptions {
  fileName: string
}

export interface MediaStorageStrategy {
  upload(options: MediaUploadOptions): Promise<MediaUploadResult>

  download(options: MediaDownloadOptions): Promise<void>

  delete(options: MediaDeleteOptions): Promise<void>
}
