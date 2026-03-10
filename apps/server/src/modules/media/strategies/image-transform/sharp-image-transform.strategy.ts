import sharp from 'sharp'

import { ImageTransformFormat, ImageTransformParameters, ImageTransformStrategy } from './image-transform.strategy'

/**
 * Image transform strategy that uses sharp to transform images
 */
export class SharpImageTransformStrategy implements ImageTransformStrategy {
  async transform(image: Buffer, format: ImageTransformFormat, parameters: ImageTransformParameters): Promise<Buffer> {
    return sharp(image)
      .resize({ width: parameters.width, height: parameters.height, fit: parameters.mode })
      .toFormat(format, { quality: parameters.quality })
      .toBuffer()
  }
}
