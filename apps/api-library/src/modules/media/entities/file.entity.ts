import { EntityType, MediaType, StorageProvider } from '../enums'

export interface FileEntity {
  id: string
  entity_type: EntityType
  entity_id: string
  media_type: MediaType
  storage_provider: StorageProvider
  file_size: number
  storage_url: string
  mime_type: string
  metadata: AudioFileMetadata | ImageFileMetadata
  created_by: string
  created_at: Date
  updated_at: Date
}

export interface AudioFileMetadata {
  duration: number
  sample_rate: number
  channels: number
}

export interface ImageFileMetadata {
  width: number
  height: number
}
