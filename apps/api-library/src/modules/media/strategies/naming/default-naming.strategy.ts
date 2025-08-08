import { NamingStrategy } from './naming.strategy'

export class DefaultNamingStrategy implements NamingStrategy {
  generateFileName(fileName: string, prefix: string): string {
    return `${prefix}-${fileName}`
  }

  generateDashManifestName(): string {
    return `manifest.mpd`
  }

  generateDashInitSegmentName(segmentNumber: number | string): string {
    return `init_${segmentNumber}.m4s`
  }

  generateDashMediaSegmentName(segmentNumber: number | string, chunkNumber: number | string): string {
    return `chunk_${segmentNumber}_${chunkNumber}.m4s`
  }
}
