import { EntityType, MediaType } from '../enums'

export interface UploadTokenEntity {
  id: string
  userId: string
  mediaType: MediaType
  entityType: EntityType
  entityId: string
  expiresAt: Date
}
