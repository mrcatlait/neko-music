import sharp from 'sharp'

import { ImageTransformOptions, ImageTransformStrategy } from './image-transform.strategy'

/**
 * Image transform strategy that uses sharp to transform images
 */
export class SharpImageTransformStrategy implements ImageTransformStrategy {
  async transform(image: Buffer, options: ImageTransformOptions): Promise<Buffer> {
    const fit = options.mode === 'crop' ? 'fill' : 'inside'

    return sharp(image)
      .resize({ width: options.width, height: options.height, fit })
      .toFormat(options.format, { quality: options.quality })
      .toBuffer()
  }
}
