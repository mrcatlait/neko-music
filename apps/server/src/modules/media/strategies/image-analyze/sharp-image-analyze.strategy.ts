import sharp from 'sharp'

import { ImageAnalyzeStrategy } from './image-analyze.strategy'

/**
 * Image analyze strategy that uses sharp to analyze images
 */
export class SharpImageAnalyzeStrategy implements ImageAnalyzeStrategy {
  async getDominantColor(image: Buffer): Promise<string> {
    const stats = await sharp(image).stats()
    const dominant = stats.dominant
    return `#${this.toHex(dominant.r)}${this.toHex(dominant.g)}${this.toHex(dominant.b)}`
  }

  private toHex(value: number): string {
    return value.toString(16).padStart(2, '0')
  }
}
