import { MetadataClaimField, MetadataConfidence } from '../../enums'
import { MetadataClaim } from '../../types'
import { YT_DLP_EXTRACTOR } from './constants'
import { SourceCandidates } from './types'
import { YtDlpMetadata } from './yt-dlp.model'

export class YoutubeGenreResolver {
  private readonly candidates: SourceCandidates[] = [
    {
      getValues: (metadata) => this.normalizeArray(metadata.genres),
      sourceAttribute: 'youtube.genres',
      confidence: MetadataConfidence.High,
    },
    {
      getValues: (metadata) => this.normalizeArray(metadata.tags),
      sourceAttribute: 'youtube.tags',
      confidence: MetadataConfidence.Medium,
    },
    {
      getValues: (metadata) => this.normalizeArray(metadata.categories),
      sourceAttribute: 'youtube.categories',
      confidence: MetadataConfidence.Low,
    },
  ]

  resolve(metadata: YtDlpMetadata): MetadataClaim[] {
    for (const candidate of this.candidates) {
      const values = candidate.getValues(metadata)

      if (!values) {
        continue
      }

      const claims: MetadataClaim[] = []

      for (const value of values) {
        claims.push({
          field: MetadataClaimField.Genre,
          value,
          sourceAttribute: candidate.sourceAttribute,
          extractor: YT_DLP_EXTRACTOR,
          confidence: candidate.confidence,
        })
      }

      return claims
    }

    throw new Error('Unable to resolve genre claim: no source attribute produced a value')
  }

  private normalizeArray(array?: string[] | string): string[] | undefined {
    if (!array) {
      return undefined
    }

    return Array.isArray(array) ? array : [array]
  }
}
