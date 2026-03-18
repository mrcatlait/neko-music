import { ImageSize } from '../../enums'
import {
  GenerateArtworkFilenameParameters,
  GenerateArtworkFilenameTemplateParameters,
  GenerateDashInitSegmentNameParameters,
  GenerateDashMediaSegmentNameParameters,
  GenerateFileNameParameters,
  GenerateStreamFilenameParameters,
  NamingStrategy,
} from './naming.strategy'

export class DefaultNamingStrategy implements NamingStrategy {
  generateFileName({ fileName, format }: GenerateFileNameParameters): string {
    if (!format) {
      return fileName
    }

    return `${fileName}.${format}`
  }

  generateRandomFileName(format: string): string {
    return this.generateFileName({ fileName: crypto.randomUUID(), format })
  }

  generateDashManifestName(): string {
    return this.generateFileName({ fileName: 'manifest', format: 'mpd' })
  }

  generateDashInitSegmentName({ segmentNumber }: GenerateDashInitSegmentNameParameters): string {
    return this.generateFileName({ fileName: `init_${segmentNumber}`, format: 'm4s' })
  }

  generateDashMediaSegmentName({ segmentNumber, chunkNumber }: GenerateDashMediaSegmentNameParameters): string {
    return this.generateFileName({ fileName: `chunk_${segmentNumber}_${chunkNumber}`, format: 'm4s' })
  }

  generateArtworkFilename({ sourceAssetFilename, presetName, format }: GenerateArtworkFilenameParameters): string {
    return `artwork/${sourceAssetFilename}/${this.generateFileName({ fileName: presetName, format })}`
  }

  generateArtworkFilenameTemplate({ sourceAssetFilename, format }: GenerateArtworkFilenameTemplateParameters): string {
    return this.generateArtworkFilename({ sourceAssetFilename, presetName: '{size}' as ImageSize, format })
  }

  generateStreamFilename({ sourceAssetId, fileName }: GenerateStreamFilenameParameters): string {
    return `stream/${sourceAssetId}/${fileName}`
  }
}
