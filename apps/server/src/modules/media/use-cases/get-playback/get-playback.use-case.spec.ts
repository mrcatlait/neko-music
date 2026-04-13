import { Test } from '@nestjs/testing'

import { GetPlaybackUseCase } from './get-playback.use-case'
import { AssetRepository, AudioMetadataRepository } from '../../repositories'
import { EntityType, MediaType } from '../../enums'

describe('GetPlaybackUseCase', () => {
  let useCase: GetPlaybackUseCase
  let assetRepository: AssetRepository
  let audioMetadataRepository: AudioMetadataRepository

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GetPlaybackUseCase,
        {
          provide: AssetRepository,
          useValue: {
            findMany: vi.fn(),
          },
        },
        {
          provide: AudioMetadataRepository,
          useValue: {
            findOne: vi.fn(),
          },
        },
      ],
    }).compile()

    useCase = moduleRef.get(GetPlaybackUseCase)
    assetRepository = moduleRef.get(AssetRepository)
    audioMetadataRepository = moduleRef.get(AudioMetadataRepository)
  })

  describe('invoke', () => {
    it('should throw when no audio asset is found', async () => {
      // Arrange
      vi.mocked(assetRepository.findMany).mockResolvedValue([])

      // Act & Assert
      await expect(
        useCase.invoke({
          entityType: EntityType.Track,
          entityId: 'track-1',
        }),
      ).rejects.toThrow('No audio asset found')
    })

    it('should throw when multiple audio assets are found', async () => {
      // Arrange
      vi.mocked(assetRepository.findMany).mockResolvedValue([
        { id: 'asset-1', storagePath: 'a', format: 'mpeg-dash' },
        { id: 'asset-2', storagePath: 'b', format: 'mpeg-dash' },
      ] as never)

      // Act & Assert
      await expect(
        useCase.invoke({
          entityType: EntityType.Track,
          entityId: 'track-1',
        }),
      ).rejects.toThrow('Multiple audio assets found')
    })

    it('should throw when metadata is missing', async () => {
      // Arrange
      vi.mocked(assetRepository.findMany).mockResolvedValue([
        { id: 'asset-1', storagePath: '/media/stream/asset-1/manifest.mpd', format: 'mpeg-dash' },
      ] as never)
      vi.mocked(audioMetadataRepository.findOne).mockResolvedValue(undefined)

      // Act & Assert
      await expect(
        useCase.invoke({
          entityType: EntityType.Track,
          entityId: 'track-1',
        }),
      ).rejects.toThrow('No audio metadata found')
    })

    it('should return playback when exactly one asset and metadata exist', async () => {
      // Arrange
      const asset = {
        id: 'asset-1',
        storagePath: '/media/stream/asset-1/manifest.mpd',
        format: 'mpeg-dash',
      }
      vi.mocked(assetRepository.findMany).mockResolvedValue([asset] as never)
      vi.mocked(audioMetadataRepository.findOne).mockResolvedValue({
        duration: 245,
      } as never)

      // Act
      const result = await useCase.invoke({
        entityType: EntityType.Track,
        entityId: 'track-1',
      })

      // Assert
      expect(assetRepository.findMany).toHaveBeenCalledWith({
        entityType: EntityType.Track,
        entityId: 'track-1',
        mediaType: MediaType.Audio,
      })
      expect(audioMetadataRepository.findOne).toHaveBeenCalledWith({
        assetId: 'asset-1',
      })
      expect(result).toEqual({
        url: asset.storagePath,
        format: asset.format,
        duration: 245,
      })
    })
  })
})
