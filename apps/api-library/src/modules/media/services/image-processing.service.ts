import { Injectable } from '@nestjs/common'
import sharp from 'sharp'
import { join } from 'path'
import { readFileSync } from 'fs'

interface CreateWebpImageOptions {
  width: number
  height: number
  sourcePath: string
  targetPath: string
}

@Injectable()
export class ImageProcessingService {
  async getPrimaryColor(sourcePath: string): Promise<string> {
    const stats = await sharp(sourcePath).stats()
    const dominant = stats.dominant
    return `#${dominant.r.toString(16)}${dominant.g.toString(16)}${dominant.b.toString(16)}`
  }

  createWebpImage(options: CreateWebpImageOptions): Promise<sharp.OutputInfo> {
    const sourceImagePath = join(options.sourcePath)
    const targetImagePath = join(options.targetPath)

    const sourceImage = readFileSync(sourceImagePath)

    return sharp(sourceImage)
      .resize({ width: options.width, height: options.height, fit: 'cover' })
      .webp()
      .toFile(targetImagePath)
  }
}
