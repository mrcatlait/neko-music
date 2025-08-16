export type ImageTransformFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif'

export type ImageTransformMode = 'cover' | 'fill'

/**
 * @todo Support presets per each type
 */
export interface ImageTransformParameters {
  width: number
  height: number
  quality?: number
  format: ImageTransformFormat
  mode?: ImageTransformMode
}

/**
 * Image transform strategy interface defines the methods that a image transform strategy must implement
 */
export interface ImageTransformStrategy {
  /**
   * Transforms an image
   * @param image - The image to transform
   * @param parameters - The parameters for the image transformation
   * @returns The transformed image
   */
  transform(image: Buffer, parameters: ImageTransformParameters): Promise<Buffer>
}
