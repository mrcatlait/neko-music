export type ImageTransformFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif'

export type ImageTransformMode = 'cover' | 'fill'

export interface ImageTransformParameters {
  /**
   * The width of the image in pixels
   */
  width: number
  /**
   * The height of the image in pixels
   */
  height: number
  /**
   * The quality of the image
   */
  quality?: number
  /**
   * The format of the image
   */
  format: ImageTransformFormat
  /**
   * The mode of the image transformation
   */
  mode?: ImageTransformMode
}

export interface ImageTransformPresets {
  /**
   * The small images used for avatars, thumbnails, etc.
   */
  small: ImageTransformParameters
  /**
   * The medium images used for medium-size images, medium-size thumbnails, etc.
   */
  medium: ImageTransformParameters
  /**
   * The large images used for full-size images, full-size thumbnails, etc.
   */
  large: ImageTransformParameters
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
