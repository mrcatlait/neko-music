import { Test } from '@nestjs/testing'
import { PartiallyMocked } from 'vitest'
import { File } from '@nest-lab/fastify-multer'
import sharp from 'sharp'

import { UploadMediaValidator } from './upload-media.validator'
import { UploadMediaCommand } from './upload-media.command'
import { UploadTokenRepository } from '../../repositories'
import { MediaType, EntityType } from '../../enums'
import { UploadTokenEntity } from '../../entities'

import { ValidationResultFailure } from '@modules/shared/models/validator.model'

// Mock sharp module
vi.mock('sharp', () => ({
  default: vi.fn(),
}))

describe('UploadMediaValidator', () => {
  let validator: UploadMediaValidator
  let uploadTokenRepositoryMock: PartiallyMocked<UploadTokenRepository>
  let sharpMock: PartiallyMocked<ReturnType<typeof sharp>>

  const mockFile: File = {
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('fake-image-data'),
    size: 1024,
  }

  const mockUploadToken: UploadTokenEntity = {
    id: 'token-123',
    userId: 'user-123',
    mediaType: MediaType.ARTWORK,
    entityType: EntityType.ARTIST,
    entityId: 'artist-123',
    expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
  }

  beforeEach(async () => {
    uploadTokenRepositoryMock = {
      findOne: vi.fn(),
    }

    sharpMock = {
      metadata: vi.fn(),
    }
    ;(sharp as any).mockReturnValue(sharpMock)

    const module = await Test.createTestingModule({
      providers: [UploadMediaValidator, { provide: UploadTokenRepository, useValue: uploadTokenRepositoryMock }],
    }).compile()

    validator = module.get(UploadMediaValidator)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('validate', () => {
    describe('when upload token is not found', () => {
      it('should return validation failure', async () => {
        // Arrange
        const command = new UploadMediaCommand(mockFile, 'user-123', 'invalid-token')
        uploadTokenRepositoryMock.findOne?.mockResolvedValue(undefined)

        // Act
        const result = (await validator.validate(command)) as ValidationResultFailure

        // Assert
        expect(result.isValid).toBe(false)
        expect(result.errors).toEqual(['Upload token not found'])
        expect(uploadTokenRepositoryMock.findOne).toHaveBeenCalledWith('invalid-token')
      })
    })

    describe('when file buffer is missing', () => {
      it('should return validation failure', async () => {
        // Arrange
        const fileWithoutBuffer = { ...mockFile, buffer: undefined }
        const command = new UploadMediaCommand(fileWithoutBuffer, 'user-123', 'token-123')
        uploadTokenRepositoryMock.findOne?.mockResolvedValue(mockUploadToken)

        // Act
        const result = (await validator.validate(command)) as ValidationResultFailure

        // Assert
        expect(result.isValid).toBe(false)
        expect(result.errors).toEqual(['File buffer is required'])
      })
    })

    describe('when media type is invalid', () => {
      it('should return validation failure', async () => {
        // Arrange
        const invalidToken = { ...mockUploadToken, mediaType: 'INVALID' as MediaType }
        const command = new UploadMediaCommand(mockFile, 'user-123', 'token-123')
        uploadTokenRepositoryMock.findOne?.mockResolvedValue(invalidToken)

        // Act
        const result = (await validator.validate(command)) as ValidationResultFailure

        // Assert
        expect(result.isValid).toBe(false)
        expect(result.errors).toEqual(['Invalid media type'])
      })
    })

    describe('when validating artwork (image)', () => {
      describe('with valid image file', () => {
        it('should return validation success for JPEG', async () => {
          // Arrange
          const command = new UploadMediaCommand(mockFile, 'user-123', 'token-123')
          uploadTokenRepositoryMock.findOne?.mockResolvedValue(mockUploadToken)
          sharpMock.metadata?.mockResolvedValue({
            width: 800,
            height: 600,
            format: 'jpeg',
          })

          // Act
          const result = await validator.validate(command)

          // Assert
          expect(result.isValid).toBe(true)
          expect(sharp).toHaveBeenCalledWith(mockFile.buffer)
          expect(sharpMock.metadata).toHaveBeenCalled()
        })

        it('should return validation success for PNG', async () => {
          // Arrange
          const pngFile = { ...mockFile, mimetype: 'image/png' }
          const command = new UploadMediaCommand(pngFile, 'user-123', 'token-123')
          uploadTokenRepositoryMock.findOne?.mockResolvedValue(mockUploadToken)
          sharpMock.metadata?.mockResolvedValue({
            width: 1024,
            height: 768,
            format: 'png',
          })

          // Act
          const result = await validator.validate(command)

          // Assert
          expect(result.isValid).toBe(true)
        })

        it('should return validation success for WebP', async () => {
          // Arrange
          const webpFile = { ...mockFile, mimetype: 'image/webp' }
          const command = new UploadMediaCommand(webpFile, 'user-123', 'token-123')
          uploadTokenRepositoryMock.findOne?.mockResolvedValue(mockUploadToken)
          sharpMock.metadata?.mockResolvedValue({
            width: 1920,
            height: 1080,
            format: 'webp',
          })

          // Act
          const result = await validator.validate(command)

          // Assert
          expect(result.isValid).toBe(true)
        })
      })

      describe('with invalid mime type', () => {
        it('should return validation failure for unsupported format', async () => {
          // Arrange
          const invalidFile = { ...mockFile, mimetype: 'image/gif' }
          const command = new UploadMediaCommand(invalidFile, 'user-123', 'token-123')
          uploadTokenRepositoryMock.findOne?.mockResolvedValue(mockUploadToken)

          // Act
          const result = (await validator.validate(command)) as ValidationResultFailure

          // Assert
          expect(result.isValid).toBe(false)
          expect(result.errors).toEqual(['Invalid image mime type'])
        })

        it('should return validation failure for non-image format', async () => {
          // Arrange
          const invalidFile = { ...mockFile, mimetype: 'application/pdf' }
          const command = new UploadMediaCommand(invalidFile, 'user-123', 'token-123')
          uploadTokenRepositoryMock.findOne?.mockResolvedValue(mockUploadToken)

          // Act
          const result = (await validator.validate(command)) as ValidationResultFailure

          // Assert
          expect(result.isValid).toBe(false)
          expect(result.errors).toEqual(['Invalid image mime type'])
        })
      })

      describe('with invalid image dimensions', () => {
        it('should return validation failure for zero width', async () => {
          // Arrange
          const command = new UploadMediaCommand(mockFile, 'user-123', 'token-123')
          uploadTokenRepositoryMock.findOne?.mockResolvedValue(mockUploadToken)
          sharpMock.metadata?.mockResolvedValue({
            width: 0,
            height: 600,
            format: 'jpeg',
          })

          // Act
          const result = (await validator.validate(command)) as ValidationResultFailure

          // Assert
          expect(result.isValid).toBe(false)
          expect(result.errors).toEqual(['Invalid image dimensions'])
        })

        it('should return validation failure for zero height', async () => {
          // Arrange
          const command = new UploadMediaCommand(mockFile, 'user-123', 'token-123')
          uploadTokenRepositoryMock.findOne?.mockResolvedValue(mockUploadToken)
          sharpMock.metadata?.mockResolvedValue({
            width: 800,
            height: 0,
            format: 'jpeg',
          })

          // Act
          const result = (await validator.validate(command)) as ValidationResultFailure

          // Assert
          expect(result.isValid).toBe(false)
          expect(result.errors).toEqual(['Invalid image dimensions'])
        })

        it('should return validation failure for zero width and height', async () => {
          // Arrange
          const command = new UploadMediaCommand(mockFile, 'user-123', 'token-123')
          uploadTokenRepositoryMock.findOne?.mockResolvedValue(mockUploadToken)
          sharpMock.metadata?.mockResolvedValue({
            width: 0,
            height: 0,
            format: 'jpeg',
          })

          // Act
          const result = (await validator.validate(command)) as ValidationResultFailure

          // Assert
          expect(result.isValid).toBe(false)
          expect(result.errors).toEqual(['Invalid image dimensions'])
        })
      })

      describe('when sharp processing fails', () => {
        it('should return validation failure for corrupted image', async () => {
          // Arrange
          const command = new UploadMediaCommand(mockFile, 'user-123', 'token-123')
          uploadTokenRepositoryMock.findOne?.mockResolvedValue(mockUploadToken)
          sharpMock.metadata?.mockRejectedValue(new Error('Invalid image format'))

          // Act
          const result = (await validator.validate(command)) as ValidationResultFailure

          // Assert
          expect(result.isValid).toBe(false)
          expect(result.errors).toEqual(['Invalid image'])
        })

        it('should return validation failure for non-image file', async () => {
          // Arrange
          const command = new UploadMediaCommand(mockFile, 'user-123', 'token-123')
          uploadTokenRepositoryMock.findOne?.mockResolvedValue(mockUploadToken)
          sharpMock.metadata?.mockRejectedValue(new Error('Unsupported format'))

          // Act
          const result = (await validator.validate(command)) as ValidationResultFailure

          // Assert
          expect(result.isValid).toBe(false)
          expect(result.errors).toEqual(['Invalid image'])
        })
      })
    })

    describe('when audio validation is commented out', () => {
      it('should return validation failure for audio media type', async () => {
        // Arrange
        const audioToken = { ...mockUploadToken, mediaType: MediaType.AUDIO }
        const command = new UploadMediaCommand(mockFile, 'user-123', 'token-123')
        uploadTokenRepositoryMock.findOne?.mockResolvedValue(audioToken)

        // Act
        const result = (await validator.validate(command)) as ValidationResultFailure

        // Assert
        expect(result.isValid).toBe(false)
        expect(result.errors).toEqual(['Invalid media type'])
      })
    })
  })
})
