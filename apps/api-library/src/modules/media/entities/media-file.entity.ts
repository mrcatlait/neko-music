import { EntityType, MediaType } from '../enums'

export interface MediaFileEntity {
  id: string
  entityType: EntityType
  entityId: string
  mediaType: MediaType
  metadata: Record<string, unknown>
}
