import { EntityType, MediaType, ProcessingStatus } from '../enums'

export interface ProcessingMediaEntity {
  id: string
  user_id: string
  entity_id: string
  entity_type: EntityType
  media_type: MediaType
  file_path: string
  status: ProcessingStatus
  created_at: Date
  updated_at: Date
}
