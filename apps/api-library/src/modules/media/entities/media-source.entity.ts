import { EntityType, MediaType, StorageProvider } from '../enums'

export interface MediaSourceEntity {
  id: string
  mediaType: MediaType
  entityId: string
  entityType: EntityType
  format: string
  fileSize: number
  storageProvider: StorageProvider
  storagePath: string
}
