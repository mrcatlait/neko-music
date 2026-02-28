export interface GenerateFileNameParameters {
  fileName: string
  format: string
}

export interface NamingStrategy {
  /**
   * Generate a file name for the given file and format
   * @param parameters The parameters
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
   * @param prefix The prefix
   * @returns The generated file name
   */
  generateDashManifestName(prefix?: string): string

  /**
   * Generate a name for the DASH initial segment file
   * @param segmentNumber The segment number
   * @param prefix The prefix
   * @returns The generated file name
   */
  generateDashInitSegmentName(segmentNumber: number | string, prefix?: string): string

  /**
   * Generate a name for the DASH media segment file
   * @param segmentNumber The segment number
   * @param chunkNumber The chunk number
   * @param prefix The prefix
   * @returns The generated file name
   */
  generateDashMediaSegmentName(segmentNumber: number | string, chunkNumber: number | string, prefix?: string): string

  /**
   * Generate an artwork filename for storage (e.g. {entityId}_small.webp).
   * Used by ImageService when creating processed assets and by artwork serving when resolving files.
   * @param entityId The entity ID
   * @param presetName The preset name
   * @param format The format
   * @returns The generated file name
   */
  generateArtworkFilename(entityId: string, presetName: string, format: string): string

  /**
   * Generate the artwork filename template for URL construction (e.g. {size}.webp).
   * The client replaces {size} with the preset name (small, medium, large).
   * @param entityId The entity ID
   * @param format The format
   * @returns The generated file name
   */
  generateArtworkFilenameTemplate(entityId: string, format: string): string
}
