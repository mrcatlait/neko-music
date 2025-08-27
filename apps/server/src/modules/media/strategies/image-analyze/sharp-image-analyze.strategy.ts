import sharp from 'sharp'

import { ImageAnalyzeStrategy } from './image-analyze.strategy'

/**
 * Image analyze strategy that uses sharp to analyze images
 */
export class SharpImageAnalyzeStrategy implements ImageAnalyzeStrategy {
  async getDominantColor(image: Buffer): Promise<string> {
    const stats = await sharp(image).stats()
    const dominant = stats.dominant
    return `#${dominant.r.toString(16)}${dominant.g.toString(16)}${dominant.b.toString(16)}`
  }
}
