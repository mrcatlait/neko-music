import { Injectable } from '@nestjs/common'
import sharp from 'sharp'
import { join } from 'path'
import { existsSync, mkdirSync, readFileSync } from 'fs'

import { IMAGE_RESOLUTIONS, MEDIA_PATH } from '../constants'
import { ImageResolution } from '../models'

interface CreateWebpImageOptions {
  width: number
  height: number
  sourcePath: string
  targetPath: string
}

interface ProcessImageOptions {
  sourcePath: string
  targetFolderPath: string
}

interface ProcessImageResult extends ImageResolution {
  filePath: string
}

@Injectable()
export class ImageProcessingService {
  async processImage(options: ProcessImageOptions): Promise<ProcessImageResult[]> {
    const path = join(MEDIA_PATH, options.targetFolderPath)

    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true })
    }

    IMAGE_RESOLUTIONS.forEach((resolution) => {
      mkdirSync(join(path, `${resolution.width}x${resolution.height}`))
    })

    const filename = 'image.webp'

    const result = await Promise.all(
      IMAGE_RESOLUTIONS.map((resolution) =>
        this.createWebpImage({
          width: resolution.width,
          height: resolution.height,
          sourcePath: options.sourcePath,
          targetPath: join(path, `${resolution.width}x${resolution.height}`, filename),
        }),
      ),
    )

    return result.map((info) => ({
      filePath: `${options.targetFolderPath}/${info.width}x${info.height}/${filename}`,
      width: info.width,
      height: info.height,
    }))
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
