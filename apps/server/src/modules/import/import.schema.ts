import { Generated } from 'kysely'

import { ClaimMatchScore, ClaimReviewDecision, ImportStatus, MetadataConfidence } from './enums'
import { EntityType } from '../media/enums'

export interface ImportJobTable {
  id: Generated<string>
  discoveryId: string | null
  /**
   * The data source of the import.
   * @example 'youtube', 'filesystem'
   */
  dataSource: string
  /**
   * The reference to the source data.
   * @example 'https://www.youtube.com/playlist?list=PL1234567890'
   */
  sourceRef: string
  /**
   * The status of the import.
   * @example 'pending', 'in_progress', 'completed', 'failed'
   * @default 'pending'
   */
  status: ImportStatus
  /**
   * The label of the import.
   * @example 'The Beatles - Abbey Road'
   */
  label: string
  createdAt: Generated<Date>
  createdBy: string
  startedAt: Date | null
  completedAt: Date | null
}

export interface ImportDiscoveryTable {
  id: Generated<string>
  dataSource: string
  sourceRef: string
  label: string
  createdAt: Generated<Date>
  createdBy: string
}

export interface ImportDiscoveryItemTable {
  id: Generated<string>
  discoveryId: string
  sourceItemRef: string
  label: string
  position: number
  isSelected: Generated<boolean>
}

export interface ImportJobItemTable {
  id: Generated<string>
  jobId: string
  /**
   * The reference to the source item.
   * @example 'https://www.youtube.com/watch?v=dQw4w9WgXc4'
   */
  sourceItemRef: string
  /**
   * The label of the import item.
   * @example 'The Beatles - Abbey Road'
   */
  label: string
  /**
   * The status of the import item.
   * @example 'pending', 'in_progress', 'completed', 'failed'
   * @default 'pending'
   */
  status: ImportStatus
  /**
   * Staged audio file path produced by strategy ingestion.
   */
  audioPath: string | null
  /**
   * Staged artwork file path produced by strategy ingestion.
   */
  artworkPath: string | null
  retryCount: Generated<number>
  lastRetriedAt: Date | null
  lastRetriedBy: string | null
  errorMessage: string | null
  startedAt: Date | null
  completedAt: Date | null
}

export interface ImportJobItemRetryHistoryTable {
  id: Generated<string>
  importJobItemId: string
  attemptNumber: number
  reason: string | null
  errorMessage: string | null
  createdAt: Generated<Date>
  createdBy: string
}

export interface MetadataClaimTable {
  id: Generated<string>
  importJobItemId: string
  /**
   * The field that was claimed.
   * @example 'title', 'artist', 'album', 'genre'
   */
  field: string
  /**
   * The value that was claimed.
   * @example 'The Beatles', 'Abbey Road', 'Rock'
   */
  value: string
  /**
   * The attribute in the source data that was used to extract the value.
   * @example 'youtube.title', 'id3.title'
   */
  sourceAttribute: string
  /**
   * The extractor that was used to extract the value.
   * @example 'yt-dlp', 'id3'
   */
  extractor: string
  confidence: MetadataConfidence
}

export interface MetadataClaimMatchTable {
  id: Generated<string>
  metadataClaimId: string
  entityId: string
  entityType: EntityType
  score: ClaimMatchScore
}

export interface MetadataClaimReviewTable {
  id: Generated<string>
  metadataClaimId: string
  decision: ClaimReviewDecision
  replacementEntityId: string | null
  replacementValue: string | null
  reviewedAt: Date | null
  reviewedBy: string | null
}

export interface MetadataClaimReviewHistoryTable {
  id: Generated<string>
  metadataClaimReviewId: string
  decisionFrom: ClaimReviewDecision | null
  decisionTo: ClaimReviewDecision
  replacementEntityIdFrom: string | null
  replacementEntityIdTo: string | null
  replacementValueFrom: string | null
  replacementValueTo: string | null
  reason: string | null
  changedAt: Generated<Date>
  changedBy: string
}

export interface ImportSchema {
  'import.ImportDiscovery': ImportDiscoveryTable
  'import.ImportDiscoveryItem': ImportDiscoveryItemTable
  'import.ImportJob': ImportJobTable
  'import.ImportJobItem': ImportJobItemTable
  'import.ImportJobItemRetryHistory': ImportJobItemRetryHistoryTable
  'import.MetadataClaim': MetadataClaimTable
  'import.MetadataClaimMatch': MetadataClaimMatchTable
  'import.MetadataClaimReview': MetadataClaimReviewTable
  'import.MetadataClaimReviewHistory': MetadataClaimReviewHistoryTable
}
