import { MediaType, EntityType } from '../enums'

export interface UploadTokenEntity {
  id: string
  user_id: string
  entity_id: string
  entity_type: EntityType
  media_type: MediaType
  expires_at: Date
}
