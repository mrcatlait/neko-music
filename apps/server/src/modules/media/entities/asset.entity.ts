import { MediaType, StorageProvider } from '../enums'

export interface AssetEntity {
  id: string
  mediaType: MediaType
  storageProvider: StorageProvider
  storagePath: string
  publicUrl: string
  fileSize: number
  format: string
}
