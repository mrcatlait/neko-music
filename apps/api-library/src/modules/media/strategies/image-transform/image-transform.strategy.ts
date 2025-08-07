export type ImageTransformFormat = 'jpg' | 'jpeg' | 'png' | 'webp' | 'avif'

export type ImageTransformMode = 'crop' | 'resize'

export interface ImageTransformOptions {
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
   * @param options - The options for the image transformation
   * @returns The transformed image
   */
  transform(image: Buffer, options: ImageTransformOptions): Promise<Buffer>
}
