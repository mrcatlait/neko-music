import { MetadataConfidence } from '../../enums'
import { YtDlpMetadata } from './yt-dlp.model'

export interface SourceCandidate {
  getValue: (metadata: YtDlpMetadata) => string | undefined
  sourceAttribute: string
  confidence: MetadataConfidence
}

export interface SourceCandidates {
  getValues: (metadata: YtDlpMetadata) => string[] | undefined
  sourceAttribute: string
  confidence: MetadataConfidence
}
