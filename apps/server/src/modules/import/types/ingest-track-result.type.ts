import { MetadataClaimField, MetadataConfidence } from '../enums'

export interface MetadataClaim {
  field: MetadataClaimField
  value: string
  sourceAttribute: string
  extractor: string
  confidence: MetadataConfidence
}

export interface TrackAssets {
  audioPath: string
  artworkPath: string
}

export interface IngestTrackResult {
  sourceItemRef: string
  claims: MetadataClaim[]
  assets: TrackAssets
}
