import { join } from 'node:path'
import { randomUUID } from 'node:crypto'

import { YtDlpFlatPlaylistMetadata, YtDlpMetadata } from './yt-dlp.model'
import { YoutubeTrackResolver } from './youtube-track.resolver'
import { FailedImportParsingException } from '../../exceptions'
import { ImportStrategy } from '../import.strategy'
import { DiscoverResult, IngestTrackResult, MetadataClaim, TrackAssets } from '../../types'

import { Runtime } from '@/modules/shared/classes'

interface YoutubeImportStrategyOptions {
  /**
   * The directory to store the downloaded media files in.
   */
  downloadDirectory: string
}

/**
 * Import strategy that imports tracks from YouTube.
 * It depends on the `yt-dlp` binary to be installed.
 * @see https://github.com/yt-dlp/yt-dlp
 */
export class YoutubeImportStrategy implements ImportStrategy {
  readonly method = {
    key: 'youtube',
    name: 'YouTube',
    description: 'Import from a playlist or video URL.',
  }
  private readonly downloadDirectory: string

  private readonly ytDlpRuntime = new Runtime({
    binaryName: 'yt-dlp',
    supportedVersionRanges: ['>=2026.1.1'],
    versionCommandArgs: ['--version'],
    maxBuffer: 64 * 1024 * 1024,
  })

  private readonly trackResolver = new YoutubeTrackResolver()

  constructor(private readonly options: YoutubeImportStrategyOptions) {
    this.downloadDirectory = options.downloadDirectory
  }

  normalizeSourceRef(sourceRef: string): string {
    const normalizedSourceRef = sourceRef.trim()
    const parsedUrl = this.parseUrl(normalizedSourceRef)

    if (!parsedUrl) {
      return normalizedSourceRef
    }

    const playlistId = parsedUrl.searchParams.get('list')

    if (playlistId) {
      return `https://www.youtube.com/playlist?list=${playlistId}`
    }

    const videoId = this.extractVideoId(parsedUrl)

    if (videoId) {
      return `https://www.youtube.com/watch?v=${videoId}`
    }

    return normalizedSourceRef
  }

  normalizeSourceItemRef(sourceItemRef: string): string {
    const normalizedSourceItemRef = sourceItemRef.trim()
    const parsedUrl = this.parseUrl(normalizedSourceItemRef)

    if (!parsedUrl) {
      return normalizedSourceItemRef
    }

    return this.extractVideoId(parsedUrl) ?? normalizedSourceItemRef
  }

  validateSourceRef(sourceRef: string): boolean {
    const normalizedSourceRef = this.normalizeSourceRef(sourceRef)
    const args = [normalizedSourceRef, '--skip-download', '--flat-playlist', '--ies', 'all,-generic']

    try {
      this.ytDlpRuntime.run(args)
    } catch {
      return false
    }

    return true
  }

  discoverTracks(sourceRef: string): DiscoverResult {
    const normalizedSourceRef = this.normalizeSourceRef(sourceRef)
    const args = [normalizedSourceRef, '--skip-download', '--flat-playlist', '-J']

    try {
      const stdout = this.ytDlpRuntime.run(args)
      const metadata = JSON.parse(stdout) as YtDlpFlatPlaylistMetadata

      if (metadata.entries && metadata.entries.length > 0) {
        return {
          sourceRef: normalizedSourceRef,
          label: metadata.title,
          tracks: metadata.entries.map((entry) => ({
            sourceItemRef: this.normalizeSourceItemRef(entry.id!),
            label: entry.title!,
          })),
        }
      }

      if (metadata.id) {
        return {
          sourceRef: normalizedSourceRef,
          label: metadata.title,
          tracks: [{ sourceItemRef: this.normalizeSourceItemRef(metadata.id), label: metadata.title }],
        }
      }
    } catch {
      // console.error('Error parsing YouTube target', { error })
    }

    throw new FailedImportParsingException(normalizedSourceRef)
  }

  ingestTrack(sourceItemRef: string): Promise<IngestTrackResult> {
    const normalizedSourceItemRef = this.normalizeSourceItemRef(sourceItemRef)

    return Promise.all([this.getClaims(normalizedSourceItemRef), this.downloadArtifacts(normalizedSourceItemRef)]).then(
      ([claims, assets]) => ({
        sourceItemRef: normalizedSourceItemRef,
        claims,
        assets,
      }),
    )
  }

  private async getClaims(sourceItemRef: string): Promise<MetadataClaim[]> {
    const args = [sourceItemRef, '--skip-download', '-J']
    const stdout = await this.ytDlpRuntime.runAsync(args)
    const ytDlpMetadata = JSON.parse(stdout) as YtDlpMetadata

    return this.trackResolver.resolve(ytDlpMetadata)
  }

  private async downloadArtifacts(sourceItemRef: string): Promise<TrackAssets> {
    const fileId = randomUUID()
    const outputTemplate = `${fileId}.%(ext)s`

    const args = [
      sourceItemRef,
      '--extract-audio',
      '--audio-format',
      'mp3',
      '--embed-metadata',
      '--embed-thumbnail',
      '--convert-thumbnails',
      'png',
      '--write-thumbnail',
      '--prefer-ffmpeg',
      '--paths',
      this.downloadDirectory,
      '-o',
      outputTemplate,
    ]

    await this.ytDlpRuntime.runAsync(args)

    return {
      audioPath: join(this.downloadDirectory, `${fileId}.mp3`),
      artworkPath: join(this.downloadDirectory, `${fileId}.png`),
    }
  }

  private parseUrl(value: string): URL | null {
    try {
      return new URL(value)
    } catch {
      return null
    }
  }

  private extractVideoId(url: URL): string | null {
    const host = url.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const videoId = url.pathname.split('/').filter(Boolean)[0]
      return videoId || null
    }

    if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      return url.searchParams.get('v')
    }

    return null
  }
}
