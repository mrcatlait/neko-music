import { Test } from '@nestjs/testing'

import { GetMediaReadinessUseCase } from './get-media-readiness.use-case'
import { MediaRepository, SourceAssetRepository } from '../../repositories'
import { EntityType, ProcessingStatus } from '../../enums'

describe('GetMediaReadinessUseCase', () => {
  let useCase: GetMediaReadinessUseCase
  let sourceAssetRepository: SourceAssetRepository
  let mediaRepository: MediaRepository

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetMediaReadinessUseCase,
        {
          provide: SourceAssetRepository,
          useValue: {
            findMany: vi.fn(),
          },
        },
        {
          provide: MediaRepository,
          useValue: {
            findProcessingJobBySourceAssetId: vi.fn(),
          },
        },
      ],
    }).compile()

    useCase = moduleRef.get(GetMediaReadinessUseCase)
    sourceAssetRepository = moduleRef.get(SourceAssetRepository)
    mediaRepository = moduleRef.get(MediaRepository)
  })

  describe('invoke', () => {
    it('should return not ready when there are no assets', async () => {
      // Arrange
      vi.mocked(sourceAssetRepository.findMany).mockResolvedValue([])

      // Act
      const result = await useCase.invoke({
        entityType: EntityType.Track,
        entityId: 'track-1',
      })

      // Assert
      expect(result).toEqual({ ready: false })
      expect(mediaRepository.findProcessingJobBySourceAssetId).not.toHaveBeenCalled()
    })

    it('should return not ready when latest asset has no job', async () => {
      // Arrange
      vi.mocked(sourceAssetRepository.findMany).mockResolvedValue([
        {
          id: 'asset-old',
          createdAt: new Date('2026-01-01'),
        },
        {
          id: 'asset-latest',
          createdAt: new Date('2026-01-02'),
        },
      ] as never)
      vi.mocked(mediaRepository.findProcessingJobBySourceAssetId).mockResolvedValue(undefined)

      // Act
      const result = await useCase.invoke({
        entityType: EntityType.Track,
        entityId: 'track-1',
      })

      // Assert
      expect(mediaRepository.findProcessingJobBySourceAssetId).toHaveBeenCalledWith('asset-latest')
      expect(result).toEqual({ ready: false })
    })

    it('should return not ready when latest asset job is not completed', async () => {
      // Arrange
      vi.mocked(sourceAssetRepository.findMany).mockResolvedValue([
        {
          id: 'asset-latest',
          createdAt: new Date('2026-01-02'),
        },
      ] as never)
      vi.mocked(mediaRepository.findProcessingJobBySourceAssetId).mockResolvedValue({
        status: ProcessingStatus.Processing,
      } as never)

      // Act
      const result = await useCase.invoke({
        entityType: EntityType.Track,
        entityId: 'track-1',
      })

      // Assert
      expect(result).toEqual({ ready: false })
    })

    it('should return ready when latest asset job is completed', async () => {
      // Arrange
      vi.mocked(sourceAssetRepository.findMany).mockResolvedValue([
        {
          id: 'asset-latest',
          createdAt: new Date('2026-01-02'),
        },
      ] as never)
      vi.mocked(mediaRepository.findProcessingJobBySourceAssetId).mockResolvedValue({
        status: ProcessingStatus.Completed,
      } as never)

      // Act
      const result = await useCase.invoke({
        entityType: EntityType.Track,
        entityId: 'track-1',
      })

      // Assert
      expect(result).toEqual({ ready: true })
    })
  })
})
