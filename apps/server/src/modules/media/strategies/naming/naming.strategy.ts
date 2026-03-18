import { ImageSize } from '../../enums/image-size.enum'

export interface GenerateFileNameParameters {
  fileName: string
  format: string
}

export interface GenerateDashManifestNameParameters {
  entityId: string
}

export interface GenerateDashInitSegmentNameParameters {
  segmentNumber: number | string
}

export interface GenerateDashMediaSegmentNameParameters {
  segmentNumber: number | string
  chunkNumber: number | string
}

export interface GenerateArtworkFilenameParameters {
  sourceAssetFilename: string
  presetName: ImageSize
  format: string
}

export interface GenerateArtworkFilenameTemplateParameters {
  sourceAssetFilename: string
  format: string
}

export interface GenerateStreamFilenameParameters {
  sourceAssetId: string
  fileName: string
}

export interface NamingStrategy {
  /**
   * Generate a file name for the given file and format
   * @param parameters The parameters for the generation {@link GenerateFileNameParameters}
   * @returns The generated file name
   */
  generateFileName(parameters: GenerateFileNameParameters): string

  /**
   * Generate a random file name for the given format
   * @param format The format
   * @returns The generated file name
   */
  generateRandomFileName(format: string): string

  /**
   * Generate a name for the DASH manifest file
   * @returns The generated file name
   */
  generateDashManifestName(): string

  /**
   * Generate a name for the DASH initial segment file
   * @param parameters The parameters for the generation {@link GenerateDashInitSegmentNameParameters}
   * @returns The generated file name
   */
  generateDashInitSegmentName(parameters: GenerateDashInitSegmentNameParameters): string

  /**
   * Generate a name for the DASH media segment file
   * @param parameters The parameters for the generation {@link GenerateDashMediaSegmentNameParameters}
   * @returns The generated file name
   */
  generateDashMediaSegmentName(parameters: GenerateDashMediaSegmentNameParameters): string

  /**
   * Generate an artwork path for storage (e.g. artwork/{sourceAssetFilename}/{presetName}.{format}).
   * @param parameters The parameters for the generation {@link GenerateArtworkFilenameParameters}
   * @returns The generated path
   */
  generateArtworkFilename(parameters: GenerateArtworkFilenameParameters): string

  /**
   * Generate the artwork URL template (e.g. artwork/{sourceAssetFilename}/{size}.webp).
   * The client replaces {size} with the preset name (small, medium, large).
   * @param parameters The parameters for the generation {@link GenerateArtworkFilenameTemplateParameters}
   * @returns The generated URL template
   */
  generateArtworkFilenameTemplate(parameters: GenerateArtworkFilenameTemplateParameters): string

  /**
   * Generate a name for the stream file (e.g. stream/{sourceAssetId}/{fileName}).
   * @param parameters The parameters for the generation {@link GenerateStreamFilenameParameters}
   * @returns The generated file name
   */
  generateStreamFilename(parameters: GenerateStreamFilenameParameters): string
}
