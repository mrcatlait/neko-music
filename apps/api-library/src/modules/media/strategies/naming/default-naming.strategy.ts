import { NamingStrategy } from './naming.strategy'

export class DefaultNamingStrategy implements NamingStrategy {
  generateFileName(fileName: string, prefix?: string): string {
    if (!prefix) {
      return fileName
    }

    return `${prefix}-${fileName}`
  }

  generateDashManifestName(prefix?: string): string {
    return this.generateFileName('manifest.mpd', prefix)
  }

  generateDashInitSegmentName(segmentNumber: number | string, prefix?: string): string {
    return this.generateFileName(`init_${segmentNumber}.m4s`, prefix)
  }

  generateDashMediaSegmentName(segmentNumber: number | string, chunkNumber: number | string, prefix?: string): string {
    return this.generateFileName(`chunk_${segmentNumber}_${chunkNumber}.m4s`, prefix)
  }
}
