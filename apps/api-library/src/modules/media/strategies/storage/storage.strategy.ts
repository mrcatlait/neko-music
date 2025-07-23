import { File } from '@nest-lab/fastify-multer'

import { StorageProvider } from '@modules/media/enums'

export interface MediaUploadOptions {
  file: File
  fileName: string
}

export interface MediaUploadResult {
  storageProvider: StorageProvider
  storagePath: string
  publicUrl: string
}

export interface MediaDeleteOptions {
  fileName: string
}

export interface MediaStorageStrategy {
  upload(options: MediaUploadOptions): Promise<MediaUploadResult>

  delete(options: MediaDeleteOptions): Promise<void>
}
