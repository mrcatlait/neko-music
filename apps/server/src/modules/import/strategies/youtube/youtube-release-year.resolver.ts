import { MetadataClaimField, MetadataConfidence } from '../../enums'
import { MetadataClaim } from '../../types'
import { YT_DLP_EXTRACTOR } from './constants'
import { SourceCandidate } from './types'
import { YtDlpMetadata } from './yt-dlp.model'

export class YoutubeReleaseYearResolver {
  private readonly candidates: SourceCandidate[] = [
    {
      getValue: (metadata) => this.parseUtcDate(metadata.release_date),
      sourceAttribute: 'youtube.release_date',
      confidence: MetadataConfidence.High,
    },
    {
      getValue: (metadata) => this.parseUnixTimestamp(metadata.release_timestamp),
      sourceAttribute: 'youtube.release_timestamp',
      confidence: MetadataConfidence.High,
    },
    {
      getValue: (metadata) => this.parseUnixTimestamp(metadata.timestamp),
      sourceAttribute: 'youtube.timestamp',
      confidence: MetadataConfidence.Medium,
    },
  ]

  resolve(metadata: YtDlpMetadata): MetadataClaim {
    for (const candidate of this.candidates) {
      const value = candidate.getValue(metadata)

      if (value) {
        return {
          field: MetadataClaimField.ReleaseDate,
          value,
          sourceAttribute: candidate.sourceAttribute,
          extractor: YT_DLP_EXTRACTOR,
          confidence: candidate.confidence,
        }
      }
    }

    throw new Error('Unable to resolve release year claim: no source attribute produced a value')
  }

  /**
   * Parses a UTC date string from YYYYMMDD format into ISO string.
   */
  private parseUtcDate(date?: string): string | undefined {
    if (!date) {
      return undefined
    }

    const year = Number(date.slice(0, 4))
    const month = Number(date.slice(4, 6))
    const day = Number(date.slice(6, 8))

    return new Date(year, month - 1, day).toISOString()
  }

  /**
   * Parses a UNIX timestamp into ISO string.
   */
  private parseUnixTimestamp(timestamp?: number): string | undefined {
    if (!timestamp) {
      return undefined
    }

    return new Date(timestamp * 1000).toISOString()
  }
}
