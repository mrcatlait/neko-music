import { SourceType, StorageProvider } from '../enums'

export interface MediaSourceEntity {
  id: string
  sourceType: SourceType
  format: string
  fileSize: number
  storageProvider: StorageProvider
  storagePath: string
}
