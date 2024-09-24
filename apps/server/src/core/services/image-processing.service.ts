import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import sharp from 'sharp'
import { join } from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { File } from '@nest-lab/fastify-multer'

import { MEDIA_PATH } from '../../app.constants'
import { ConfigService } from './config.service'

interface ResizeImageOptions {
  width: number
  height: number
  sourcePath: string
  targetPath: string
}

interface ResolutionOptions {
  image: File
  folderPath: string
}

interface ImageWithResolution {
  resolution: string
  url: string
}

@Injectable()
export class ImageProcessingService {
  private readonly logger = new Logger(ImageProcessingService.name)

  constructor(private readonly configService: ConfigService) {}

  async makeResolutions(options: ResolutionOptions): Promise<ImageWithResolution[]> {
    const data = options.image.buffer

    if (!data) {
      throw new InternalServerErrorException()
    }

    const path = join(MEDIA_PATH, options.folderPath)

    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true })

      mkdirSync(join(path, 'original'))
    }

    mkdirSync(join(path, '56x56'))
    mkdirSync(join(path, '256x256'))
    mkdirSync(join(path, '720x720'))

    const filename = 'image.webp'

    const originalImagePath = join(path, 'original', 'image.png')

    writeFileSync(originalImagePath, data)

    const result = await Promise.all([
      this.resizeImage({
        width: 56,
        height: 56,
        sourcePath: originalImagePath,
        targetPath: join(path, '56x56', filename),
      }),
      this.resizeImage({
        width: 256,
        height: 256,
        sourcePath: originalImagePath,
        targetPath: join(path, '256x256', filename),
      }),
      this.resizeImage({
        width: 720,
        height: 720,
        sourcePath: originalImagePath,
        targetPath: join(path, '720x720', filename),
      }),
    ])

    return result.map((info) => {
      return {
        resolution: `${info.width}x${info.height}`,
        url: new URL(
          `${options.folderPath}/${info.width}x${info.height}/${filename}`,
          this.configService.get('MEDIA_URL'),
        ).href,
      }
    })
  }

  resizeImage(options: ResizeImageOptions): Promise<sharp.OutputInfo> {
    const sourceImagePath = join(options.sourcePath)
    const targetImagePath = join(options.targetPath)

    const sourceImage = readFileSync(sourceImagePath)

    return sharp(sourceImage)
      .resize({ width: options.width, height: options.height, fit: 'cover' })
      .webp()
      .toFile(targetImagePath)
  }
}
