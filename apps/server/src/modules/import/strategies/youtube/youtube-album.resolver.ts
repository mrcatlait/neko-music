import { MetadataClaimField, MetadataConfidence } from '../../enums'
import { YtDlpMetadata } from './yt-dlp.model'
import { MetadataClaim } from '../../types'
import { YT_DLP_EXTRACTOR } from './constants'
import { SourceCandidate } from './types'

export class YoutubeAlbumResolver {
  private readonly candidates: SourceCandidate[] = [
    {
      getValue: (metadata) => metadata.album,
      sourceAttribute: 'youtube.album',
      confidence: MetadataConfidence.High,
    },
    {
      getValue: (metadata) => metadata.playlist_title,
      sourceAttribute: 'youtube.playlist_title',
      confidence: MetadataConfidence.Medium,
    },
    {
      getValue: (metadata) => metadata.track,
      sourceAttribute: 'youtube.track',
      confidence: MetadataConfidence.Low,
    },
    {
      getValue: (metadata) => metadata.title,
      sourceAttribute: 'youtube.title',
      confidence: MetadataConfidence.Low,
    },
  ]

  resolve(metadata: YtDlpMetadata): MetadataClaim {
    for (const candidate of this.candidates) {
      const value = candidate.getValue(metadata)

      if (value) {
        return {
          field: MetadataClaimField.Album,
          value,
          sourceAttribute: candidate.sourceAttribute,
          extractor: YT_DLP_EXTRACTOR,
          confidence: candidate.confidence,
        }
      }
    }

    throw new Error('Unable to resolve album claim: no source attribute produced a value')
  }
}
