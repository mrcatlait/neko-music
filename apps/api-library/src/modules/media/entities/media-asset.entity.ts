import { EntityType, StorageProvider } from '../enums'

export interface MediaAssetEntity {
  id: string
  entityType: EntityType
  entityId: string
  sourceId: string
  storageProvider: StorageProvider
  storagePath: string
  publicUrl?: string
  fileSize?: number
  format?: string
}
