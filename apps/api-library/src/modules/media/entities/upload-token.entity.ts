import { EntityType, MediaType } from '../enums'

export interface UploadTokenEntity {
  id: string
  user_id: string
  media_type: MediaType
  entity_type: EntityType
  entity_id: string
  expires_at: Date
}
