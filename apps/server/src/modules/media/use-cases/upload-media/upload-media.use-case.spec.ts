import { Test } from '@nestjs/testing'
import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { UploadMediaUseCase } from './upload-media.use-case'
import { UploadImageValidator } from './upload-image.validator'
import { UploadAudioValidator } from './upload-audio.validator'
import { MediaRepository, SourceAssetRepository, UploadTokenRepository } from '../../repositories'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { MediaUploadedEvent } from '../../events'
import { EntityType, MediaType, ProcessingStatus, ProcessingStep, StorageProvider } from '../../enums'
import { FileService } from '../../services'
import { MediaModuleOptions } from '../../types'
import { NamingStrategy, StorageStrategy } from '../../strategies'

describe('UploadMediaUseCase', () => {
  let useCase: UploadMediaUseCase
  let eventEmitter: EventEmitter2
  let mediaRepository: MediaRepository
  let uploadTokenRepository: UploadTokenRepository
  let fileService: FileService
  let sourceAssetRepository: SourceAssetRepository
  let uploadAudioValidator: UploadAudioValidator
  let storageStrategy: StorageStrategy
  let namingStrategy: NamingStrategy

  beforeEach(async () => {
    storageStrategy = {
      name: StorageProvider.Local,
      uploadFromBuffer: vi.fn().mockResolvedValue('/tmp/source/file.mp3'),
      uploadFromStream: vi.fn(),
      uploadFromFile: vi.fn(),
      downloadToBuffer: vi.fn(),
      downloadToStream: vi.fn(),
      downloadToFile: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
    }

    namingStrategy = {
      generateFileName: vi.fn(),
      generateRandomFileName: vi.fn().mockReturnValue('generated-name.mp3'),
      generateDashManifestName: vi.fn(),
      generateDashInitSegmentName: vi.fn(),
      generateDashMediaSegmentName: vi.fn(),
      generateArtworkFilename: vi.fn(),
      generateArtworkFilenameTemplate: vi.fn(),
      generateStreamFilename: vi.fn(),
    }

    const moduleOptions: MediaModuleOptions = {
      storageStrategy,
      imageTransformStrategy: {} as MediaModuleOptions['imageTransformStrategy'],
      imageTransformPresets: {
        format: 'webp',
        small: { width: 56, height: 56, mode: 'cover' },
        medium: { width: 256, height: 256, mode: 'cover' },
        large: { width: 720, height: 720, mode: 'cover' },
      },
      imageAnalyzeStrategy: {} as MediaModuleOptions['imageAnalyzeStrategy'],
      audioTransformStrategy: {} as MediaModuleOptions['audioTransformStrategy'],
      audioTransformPreset: {
        bitrate: ['128k'],
        channels: 2,
        sampleRate: 44100,
        codec: 'aac',
        segmentDuration: 10,
      },
      namingStrategy,
      temporaryDirectory: '/tmp',
      allowedImageMimeTypes: ['image/png'],
      maxImageSize: 1024,
      allowedAudioMimeTypes: ['audio/mpeg'],
      maxAudioSize: 1024 * 1024,
      uploadTokenExpiresIn: '15m',
      maxConcurrentProcessingJobs: 2,
    }

    const moduleRef = await Test.createTestingModule({
      providers: [
        UploadMediaUseCase,
        {
          provide: MEDIA_MODULE_OPTIONS,
          useValue: moduleOptions,
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: vi.fn(),
          },
        },
        {
          provide: MediaRepository,
          useValue: {
            createSourceAssetAndProcessingJob: vi.fn(),
            findProcessingJobBySourceAssetId: vi.fn(),
          },
        },
        {
          provide: UploadTokenRepository,
          useValue: {
            findOne: vi.fn(),
            delete: vi.fn(),
          },
        },
        {
          provide: FileService,
          useValue: {
            getFileTypeFromBuffer: vi.fn(),
            computeChecksumFromBuffer: vi.fn(),
          },
        },
        {
          provide: SourceAssetRepository,
          useValue: {
            exists: vi.fn(),
            findMany: vi.fn(),
          },
        },
        {
          provide: UploadImageValidator,
          useValue: {
            validate: vi.fn(),
          },
        },
        {
          provide: UploadAudioValidator,
          useValue: {
            validate: vi.fn(),
          },
        },
      ],
    }).compile()

    useCase = moduleRef.get(UploadMediaUseCase)
    eventEmitter = moduleRef.get(EventEmitter2)
    mediaRepository = moduleRef.get(MediaRepository)
    uploadTokenRepository = moduleRef.get(UploadTokenRepository)
    fileService = moduleRef.get(FileService)
    sourceAssetRepository = moduleRef.get(SourceAssetRepository)
    uploadAudioValidator = moduleRef.get(UploadAudioValidator)
  })

  describe('invoke', () => {
    it('should throw when token is not found', async () => {
      // Arrange
      vi.mocked(uploadTokenRepository.findOne).mockResolvedValue(undefined)

      // Act & Assert
      await expect(useCase.invoke({ token: 'missing', file: {} as never })).rejects.toThrow(ForbiddenException)
    })

    it('should reject when media for entity is already processing', async () => {
      // Arrange
      const uploadToken = {
        id: 'token-1',
        userId: 'user-1',
        mediaType: MediaType.Audio,
        entityType: EntityType.Track,
        entityId: 'track-1',
      }
      vi.mocked(uploadTokenRepository.findOne).mockResolvedValue(uploadToken as never)
      vi.mocked(fileService.computeChecksumFromBuffer).mockReturnValue('sha256')
      vi.mocked(sourceAssetRepository.exists).mockResolvedValue(false)
      vi.mocked(sourceAssetRepository.findMany).mockResolvedValue([
        { id: 'source-1', createdAt: new Date('2026-01-02') },
      ] as never)
      vi.mocked(mediaRepository.findProcessingJobBySourceAssetId).mockResolvedValue({
        status: ProcessingStatus.Pending,
      } as never)

      // Act & Assert
      await expect(
        useCase.invoke({
          token: 'token-1',
          file: { buffer: Buffer.from('a'), size: 123, mimetype: 'audio/mpeg' } as never,
        }),
      ).rejects.toThrow(new BadRequestException('Media is already being processed'))
    })

    it('should reject duplicate media uploads for the same entity and media type', async () => {
      // Arrange
      const uploadToken = {
        id: 'token-1',
        userId: 'user-1',
        mediaType: MediaType.Audio,
        entityType: EntityType.Track,
        entityId: 'track-1',
      }
      vi.mocked(uploadTokenRepository.findOne).mockResolvedValue(uploadToken as never)
      vi.mocked(fileService.computeChecksumFromBuffer).mockReturnValue('sha256')
      vi.mocked(sourceAssetRepository.exists).mockResolvedValue(true)
      vi.mocked(sourceAssetRepository.findMany).mockResolvedValue([])

      // Act & Assert
      await expect(
        useCase.invoke({
          token: 'token-1',
          file: { buffer: Buffer.from('a'), size: 123, mimetype: 'audio/mpeg' } as never,
        }),
      ).rejects.toThrow(new BadRequestException('Duplicate media upload'))
    })

    it('should create source asset and processing job atomically', async () => {
      // Arrange
      const uploadToken = {
        id: 'token-1',
        userId: 'user-1',
        mediaType: MediaType.Audio,
        entityType: EntityType.Track,
        entityId: 'track-1',
      }
      vi.mocked(uploadTokenRepository.findOne).mockResolvedValue(uploadToken as never)
      vi.mocked(fileService.computeChecksumFromBuffer).mockReturnValue('sha256')
      vi.mocked(fileService.getFileTypeFromBuffer).mockResolvedValue('mp3')
      vi.mocked(sourceAssetRepository.exists).mockResolvedValue(false)
      vi.mocked(sourceAssetRepository.findMany).mockResolvedValue([])
      vi.mocked(mediaRepository.createSourceAssetAndProcessingJob).mockResolvedValue('job-1')

      // Act
      const result = await useCase.invoke({
        token: 'token-1',
        file: { buffer: Buffer.from('a'), size: 123, mimetype: 'audio/mpeg' } as never,
      })

      // Assert
      expect(uploadAudioValidator.validate).toHaveBeenCalled()
      expect(mediaRepository.createSourceAssetAndProcessingJob).toHaveBeenCalledWith(
        expect.objectContaining({
          mediaType: MediaType.Audio,
          entityType: EntityType.Track,
          entityId: 'track-1',
          checksum: 'sha256',
        }),
        [ProcessingStep.AudioTransformation],
      )
      expect(uploadTokenRepository.delete).toHaveBeenCalledWith(uploadToken.id)
      expect(eventEmitter.emit).toHaveBeenCalledWith(
        MediaUploadedEvent.event,
        expect.objectContaining({
          payload: {
            entityType: EntityType.Track,
            entityId: 'track-1',
          },
        }),
      )
      expect(result).toEqual({ processingJobId: 'job-1' })
    })

    it('should delete uploaded source file when DB creation fails', async () => {
      // Arrange
      const uploadToken = {
        id: 'token-1',
        userId: 'user-1',
        mediaType: MediaType.Audio,
        entityType: EntityType.Track,
        entityId: 'track-1',
      }
      const storagePath = '/tmp/source/file.mp3'
      vi.mocked(uploadTokenRepository.findOne).mockResolvedValue(uploadToken as never)
      vi.mocked(fileService.computeChecksumFromBuffer).mockReturnValue('sha256')
      vi.mocked(fileService.getFileTypeFromBuffer).mockResolvedValue('mp3')
      vi.mocked(sourceAssetRepository.exists).mockResolvedValue(false)
      vi.mocked(sourceAssetRepository.findMany).mockResolvedValue([])
      vi.mocked(storageStrategy.uploadFromBuffer).mockResolvedValue(storagePath)
      vi.mocked(mediaRepository.createSourceAssetAndProcessingJob).mockRejectedValue(new Error('db failed'))

      // Act & Assert
      await expect(
        useCase.invoke({
          token: 'token-1',
          file: { buffer: Buffer.from('a'), size: 123, mimetype: 'audio/mpeg' } as never,
        }),
      ).rejects.toThrow('db failed')
      expect(storageStrategy.delete).toHaveBeenCalledWith(storagePath)
    })
  })
})
