import { Test } from '@nestjs/testing'
import { InternalServerErrorException } from '@nestjs/common'
import { join } from 'path'
import { File } from '@nest-lab/fastify-multer'
import sharp from 'sharp'

import { ImageProcessingService } from './image-processing.service'
import { ConfigService } from './config.service'

import { MEDIA_PATH } from 'src/app.constants'

const fsMock = vi.hoisted(() => {
  return {
    existsSync: vi.fn().mockReturnValue(true),
    mkdirSync: vi.fn().mockImplementation(() => {}),
    readFileSync: vi.fn().mockImplementation(() => {}),
    writeFileSync: vi.fn().mockImplementation(() => {}),
  }
})
vi.mock('fs', () => fsMock)

const sharpMock = vi.hoisted(() => {
  return {
    default: vi.fn().mockReturnThis(),
    resize: vi.fn().mockReturnThis(),
    webp: vi.fn().mockReturnThis(),
    toFile: vi.fn().mockImplementation(() => Promise.resolve({} as sharp.OutputInfo)),
  }
})
vi.mock('sharp', () => sharpMock)

describe('ImageProcessingService', () => {
  let service: ImageProcessingService
  let configService: ConfigService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ImageProcessingService,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn(),
          },
        },
      ],
    }).compile()

    service = module.get(ImageProcessingService)
    configService = module.get(ConfigService)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('makeResolutions', () => {
    const imageBuffer = Buffer.from('sample image data')
    const options = {
      image: {
        buffer: imageBuffer,
        mimetype: 'image/png',
      } as File,
      folderPath: 'sample-folder',
    }

    beforeEach(() => {
      vi.spyOn(configService, 'get').mockReturnValue('http://example.com/media')
      vi.spyOn(service, 'resizeImage').mockImplementation((resizeOpt) =>
        Promise.resolve({ width: resizeOpt.width, height: resizeOpt.height } as sharp.OutputInfo),
      )
    })

    it('should create resolutions and return the URLs', async () => {
      // Arrange
      const originalImagePath = join(MEDIA_PATH, options.folderPath, 'original', 'image.png')
      const resized56x56ImagePath = join(MEDIA_PATH, options.folderPath, '56x56', 'image.webp')
      const resized256x256ImagePath = join(MEDIA_PATH, options.folderPath, '256x256', 'image.webp')
      const resized720x720ImagePath = join(MEDIA_PATH, options.folderPath, '720x720', 'image.webp')

      // Act
      const result = await service.makeResolutions(options)

      // Assert
      expect(fsMock.writeFileSync).toHaveBeenCalledWith(originalImagePath, imageBuffer)

      expect(service.resizeImage).toHaveBeenCalledWith({
        width: 56,
        height: 56,
        sourcePath: originalImagePath,
        targetPath: resized56x56ImagePath,
      })
      expect(service.resizeImage).toHaveBeenCalledWith({
        width: 256,
        height: 256,
        sourcePath: originalImagePath,
        targetPath: resized256x256ImagePath,
      })
      expect(service.resizeImage).toHaveBeenCalledWith({
        width: 720,
        height: 720,
        sourcePath: originalImagePath,
        targetPath: resized720x720ImagePath,
      })

      expect(result).toEqual([
        {
          resolution: '56x56',
          url: 'http://example.com/sample-folder/56x56/image.webp',
        },
        {
          resolution: '256x256',
          url: 'http://example.com/sample-folder/256x256/image.webp',
        },
        {
          resolution: '720x720',
          url: 'http://example.com/sample-folder/720x720/image.webp',
        },
      ])
    })

    it('should throw an InternalServerErrorException if image buffer is missing', async () => {
      // Arrange
      const invalidOptions = { ...options, image: { buffer: undefined } as File }

      // Act & Assert
      await expect(service.makeResolutions(invalidOptions)).rejects.toThrow(InternalServerErrorException)
    })
  })

  describe('resizeImage', () => {
    it('should resize the image and return the output info', async () => {
      // Arrange
      const sourcePath = '/path/to/source/image.png'
      const targetPath = '/path/to/target/image.png'
      const resizeOptions = {
        width: 100,
        height: 100,
        sourcePath,
        targetPath,
      }

      // Act
      const result = await service.resizeImage(resizeOptions)

      // Assert
      expect(sharpMock.resize).toHaveBeenCalledWith({ width: 100, height: 100, fit: 'cover' })
      expect(sharpMock.toFile).toHaveBeenCalledWith(join(targetPath))
      expect(result).toEqual({} as sharp.OutputInfo)
    })
  })
})
