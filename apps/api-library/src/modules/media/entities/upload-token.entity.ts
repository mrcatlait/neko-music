import { MediaType } from '../enums'

export interface UploadTokenEntity {
  id: string
  user_id: string
  media_type: MediaType
  expires_at: Date
}
