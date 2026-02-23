import { Generated } from 'kysely'

import { EntityType, MediaType, ProcessingStatus, ProcessingStep, StorageProvider } from '@/modules/media/enums'

export interface UploadTokenTable {
  id: Generated<string>
  userId: string
  mediaType: MediaType
  entityType: EntityType
  entityId: string
  createdAt: Generated<Date>
  expiresAt: Date
}

export interface SourceAssetTable {
  id: Generated<string>
  mediaType: MediaType
  entityType: EntityType
  entityId: string
  format: string
  fileSize: number
  storageProvider: StorageProvider
  storagePath: string
  checksum: string
  createdBy: string
  createdAt: Generated<Date>
}

export interface AssetTable {
  id: Generated<string>
  sourceAssetId: string
  mediaType: MediaType
  entityType: EntityType
  entityId: string
  storageProvider: StorageProvider
  storagePath: string
  fileSize: number
  format: string
  createdAt: Generated<Date>
}

export interface ImageMetadataTable {
  assetId: string
  width: number
  height: number
  dominantColor: string
}

export interface AudioMetadataTable {
  assetId: string
  bitrate: string
  sampleRate: number
  channels: number
  codec: string
  duration: number
}

export interface ProcessingStepTable {
  id: Generated<string>
  jobId: string
  name: ProcessingStep
  order: number
  status: ProcessingStatus
  startedAt: Date | null
  completedAt: Date | null
  errorMessage: string | null
}

export interface ProcessingJobTable {
  id: Generated<string>
  sourceAssetId: string
  status: ProcessingStatus
  createdAt: Generated<Date>
  startedAt: Date | null
  completedAt: Date | null
}

export interface MediaSchema {
  'media.UploadToken': UploadTokenTable
  'media.SourceAsset': SourceAssetTable
  'media.Asset': AssetTable
  'media.ImageMetadata': ImageMetadataTable
  'media.AudioMetadata': AudioMetadataTable
  'media.ProcessingJob': ProcessingJobTable
  'media.ProcessingStep': ProcessingStepTable
}
