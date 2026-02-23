import { GenerateFileNameParameters, NamingStrategy } from './naming.strategy'

export class DefaultNamingStrategy implements NamingStrategy {
  generateFileName({ fileName, format }: GenerateFileNameParameters): string {
    if (!format) {
      return fileName
    }

    return `${fileName}.${format}`
  }

  generateRandomFileName(format: string): string {
    return `${crypto.randomUUID()}.${format}`
  }

  generateDashManifestName(): string {
    return this.generateFileName({ fileName: 'manifest', format: 'mpd' })
  }

  generateDashInitSegmentName(segmentNumber: number | string): string {
    return this.generateFileName({ fileName: `init_${segmentNumber}`, format: 'm4s' })
  }

  generateDashMediaSegmentName(segmentNumber: number | string, chunkNumber: number | string): string {
    return this.generateFileName({ fileName: `chunk_${segmentNumber}_${chunkNumber}`, format: 'm4s' })
  }
}
