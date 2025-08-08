import sharp from 'sharp'

import { ImageTransformParameters, ImageTransformStrategy } from './image-transform.strategy'

/**
 * Image transform strategy that uses sharp to transform images
 */
export class SharpImageTransformStrategy implements ImageTransformStrategy {
  async transform(image: Buffer, parameters: ImageTransformParameters): Promise<Buffer> {
    const fit = parameters.mode === 'crop' ? 'fill' : 'inside'

    return sharp(image)
      .resize({ width: parameters.width, height: parameters.height, fit })
      .toFormat(parameters.format, { quality: parameters.quality })
      .toBuffer()
  }
}
