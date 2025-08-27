/**
 * Image analyze strategy interface defines the methods that a image analyze strategy must implement
 */
export interface ImageAnalyzeStrategy {
  /**
   * Gets the dominant color of an image
   * @param image - The image to analyze
   * @returns The dominant color of the image in hex format
   */
  getDominantColor(image: Buffer): Promise<string>
}
