import { BadRequestException } from '@nestjs/common'

import { DiscoverImportUseCase } from './discover-import.use-case'
import { ImportDiscoveryItemRepository, ImportDiscoveryRepository } from '../../repositories'
import { ImportStrategyFactory, ImportStrategy } from '../../strategies'
import { MetadataClaimField, MetadataConfidence } from '../../enums'

describe('DiscoverImportUseCase', () => {
  let useCase: DiscoverImportUseCase
  let importStrategyFactory: ImportStrategyFactory
  let importDiscoveryRepository: ImportDiscoveryRepository
  let importDiscoveryItemRepository: ImportDiscoveryItemRepository

  beforeEach(() => {
    importStrategyFactory = {
      create: vi.fn(),
    } as unknown as ImportStrategyFactory

    importDiscoveryRepository = {
      create: vi.fn(),
    } as unknown as ImportDiscoveryRepository

    importDiscoveryItemRepository = {
      createMany: vi.fn(),
    } as unknown as ImportDiscoveryItemRepository

    useCase = new DiscoverImportUseCase(importStrategyFactory, importDiscoveryRepository, importDiscoveryItemRepository)
  })

  it('should create discovery and tracks for a valid source', async () => {
    // Arrange
    const strategy: ImportStrategy = {
      method: {
        key: 'youtube',
        name: 'YouTube',
        description: 'Import from YouTube.',
      },
      normalizeSourceRef: vi.fn((sourceRef) => sourceRef),
      normalizeSourceItemRef: vi.fn((sourceItemRef) => sourceItemRef),
      validateSourceRef: vi.fn().mockReturnValue(true),
      discoverTracks: vi.fn().mockResolvedValue({
        sourceRef: 'https://youtube.com/watch?v=abc123',
        label: 'Synthwave Mix',
        tracks: [
          {
            sourceItemRef: 'abc123',
            label: 'Track A',
          },
        ],
      }),
      ingestTrack: vi.fn().mockResolvedValue({
        sourceItemRef: 'abc123',
        claims: [
          {
            field: MetadataClaimField.Title,
            value: 'Track A',
            sourceAttribute: 'youtube.title',
            extractor: 'yt-dlp',
            confidence: MetadataConfidence.High,
          },
        ],
        assets: {
          audioPath: '/tmp/track-a.mp3',
          artworkPath: '/tmp/track-a.png',
        },
      }),
    }

    vi.mocked(importStrategyFactory.create).mockReturnValue(strategy)
    vi.mocked(importDiscoveryRepository.create).mockResolvedValue({
      id: 'discovery-1',
      dataSource: 'youtube',
      sourceRef: 'https://youtube.com/watch?v=abc123',
      label: 'Synthwave Mix',
      createdAt: new Date(),
      createdBy: 'user-1',
    })
    vi.mocked(importDiscoveryItemRepository.createMany).mockResolvedValue([
      {
        id: 'item-1',
        discoveryId: 'discovery-1',
        sourceItemRef: 'abc123',
        label: 'Track A',
        position: 0,
        isSelected: true,
      },
    ])

    // Act
    const result = await useCase.invoke({
      dataSource: 'youtube',
      sourceRef: 'https://youtube.com/watch?v=abc123',
      userId: 'user-1',
    })

    // Assert
    expect(importStrategyFactory.create).toHaveBeenCalledWith('youtube')
    expect(importDiscoveryRepository.create).toHaveBeenCalledWith({
      dataSource: 'youtube',
      sourceRef: 'https://youtube.com/watch?v=abc123',
      label: 'Synthwave Mix',
      createdBy: 'user-1',
    })
    expect(importDiscoveryItemRepository.createMany).toHaveBeenCalledWith([
      {
        discoveryId: 'discovery-1',
        sourceItemRef: 'abc123',
        label: 'Track A',
        position: 0,
      },
    ])
    expect(result).toEqual({
      id: 'discovery-1',
      dataSource: 'youtube',
      sourceRef: 'https://youtube.com/watch?v=abc123',
      label: 'Synthwave Mix',
      tracks: [
        {
          id: 'item-1',
          sourceItemRef: 'abc123',
          label: 'Track A',
          position: 0,
          isSelected: true,
        },
      ],
    })
  })

  it('should throw when source reference is invalid', async () => {
    // Arrange
    const strategy: ImportStrategy = {
      method: {
        key: 'youtube',
        name: 'YouTube',
        description: 'Import from YouTube.',
      },
      normalizeSourceRef: vi.fn((sourceRef) => sourceRef),
      normalizeSourceItemRef: vi.fn((sourceItemRef) => sourceItemRef),
      validateSourceRef: vi.fn().mockReturnValue(false),
      discoverTracks: vi.fn(),
      ingestTrack: vi.fn(),
    }

    vi.mocked(importStrategyFactory.create).mockReturnValue(strategy)

    // Act & Assert
    await expect(
      useCase.invoke({
        dataSource: 'youtube',
        sourceRef: 'invalid',
        userId: 'user-1',
      }),
    ).rejects.toThrow(BadRequestException)

    expect(importDiscoveryRepository.create).not.toHaveBeenCalled()
    expect(importDiscoveryItemRepository.createMany).not.toHaveBeenCalled()
  })

  it('should fallback to source item ref when track label is empty', async () => {
    // Arrange
    const strategy: ImportStrategy = {
      method: {
        key: 'youtube',
        name: 'YouTube',
        description: 'Import from YouTube.',
      },
      normalizeSourceRef: vi.fn((sourceRef) => sourceRef),
      normalizeSourceItemRef: vi.fn((sourceItemRef) => sourceItemRef),
      validateSourceRef: vi.fn().mockReturnValue(true),
      discoverTracks: vi.fn().mockResolvedValue({
        sourceRef: 'https://youtube.com/watch?v=abc123',
        label: 'Synthwave Mix',
        tracks: [
          {
            sourceItemRef: 'abc123',
            label: '',
          },
        ],
      }),
      ingestTrack: vi.fn(),
    }

    vi.mocked(importStrategyFactory.create).mockReturnValue(strategy)
    vi.mocked(importDiscoveryRepository.create).mockResolvedValue({
      id: 'discovery-1',
      dataSource: 'youtube',
      sourceRef: 'https://youtube.com/watch?v=abc123',
      label: 'Synthwave Mix',
      createdAt: new Date(),
      createdBy: 'user-1',
    })
    vi.mocked(importDiscoveryItemRepository.createMany).mockResolvedValue([
      {
        id: 'item-1',
        discoveryId: 'discovery-1',
        sourceItemRef: 'abc123',
        label: 'abc123',
        position: 0,
        isSelected: true,
      },
    ])

    // Act
    await useCase.invoke({
      dataSource: 'youtube',
      sourceRef: 'https://youtube.com/watch?v=abc123',
      userId: 'user-1',
    })

    // Assert
    expect(importDiscoveryItemRepository.createMany).toHaveBeenCalledWith([
      {
        discoveryId: 'discovery-1',
        sourceItemRef: 'abc123',
        label: 'abc123',
        position: 0,
      },
    ])
  })
})
