export interface NamingStrategy {
  /**
   * Generate a file name for the given file and prefix
   * @param fileName The file name
   * @param prefix The prefix
   * @returns The generated file name
   */
  generateFileName(fileName: string, prefix: string): string

  /**
   * Generate a name for the DASH manifest file
   * @returns The generated file name
   */
  generateDashManifestName(): string

  /**
   * Generate a name for the DASH initial segment file
   * @param segmentNumber The segment number
   * @returns The generated file name
   */
  generateDashInitSegmentName(segmentNumber: number | string): string

  /**
   * Generate a name for the DASH media segment file
   * @param segmentNumber The segment number
   * @param chunkNumber The chunk number
   * @returns The generated file name
   */
  generateDashMediaSegmentName(segmentNumber: number | string, chunkNumber: number | string): string
}
