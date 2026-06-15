import { MetadataClaimField, MetadataConfidence } from '../../enums'
import { YtDlpMetadata } from './yt-dlp.model'
import { SourceCandidates } from './types'
import { MetadataClaim } from '../../types'
import { YT_DLP_EXTRACTOR } from './constants'

export class YoutubeArtistResolver {
  private readonly candidates: SourceCandidates[] = [
    {
      getValues: (metadata) => this.normalizeArray(metadata.artist),
      sourceAttribute: 'youtube.artist',
      confidence: MetadataConfidence.High,
    },
    {
      getValues: (metadata) => this.normalizeArray(metadata.creator),
      sourceAttribute: 'youtube.creator',
      confidence: MetadataConfidence.High,
    },
    {
      getValues: (metadata) => this.normalizeArray(metadata.artists),
      sourceAttribute: 'youtube.artists',
      confidence: MetadataConfidence.High,
    },
    {
      getValues: (metadata) => this.normalizeArray(this.normalizeTopicChannelName(metadata.channel)),
      sourceAttribute: 'youtube.channel',
      confidence: MetadataConfidence.Medium,
    },
    {
      getValues: (metadata) => this.normalizeArray(metadata.uploader),
      sourceAttribute: 'youtube.uploader',
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
          field: MetadataClaimField.Artist,
          value,
          sourceAttribute: candidate.sourceAttribute,
          extractor: YT_DLP_EXTRACTOR,
          confidence: candidate.confidence,
        })
      }

      return claims
    }

    throw new Error('Unable to resolve artist claim: no source attribute produced a value')
  }

  private normalizeTopicChannelName(channel?: string): string | undefined {
    if (!channel) {
      return undefined
    }

    const suffix = ' - Topic'

    if (!channel.endsWith(suffix)) {
      return undefined
    }

    return channel.slice(0, -suffix.length).trim()
  }

  private normalizeArray(array?: string[] | string): string[] | undefined {
    if (!array) {
      return undefined
    }

    return Array.isArray(array) ? array : [array]
  }
}
