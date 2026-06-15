import { NotFoundException } from '@nestjs/common'

import { RefreshImportDiscoveryUseCase } from './refresh-import-discovery.use-case'
import { ImportDiscoveryItemRepository, ImportDiscoveryRepository } from '../../repositories'
import { ImportStrategyFactory } from '../../strategies'

describe('RefreshImportDiscoveryUseCase', () => {
  let useCase: RefreshImportDiscoveryUseCase
  let importDiscoveryRepository: ImportDiscoveryRepository
  let importDiscoveryItemRepository: ImportDiscoveryItemRepository
  let importStrategyFactory: ImportStrategyFactory

  beforeEach(() => {
    importDiscoveryRepository = {
      findOne: vi.fn(),
      create: vi.fn(),
    } as unknown as ImportDiscoveryRepository
    importDiscoveryItemRepository = {
      findMany: vi.fn(),
      createMany: vi.fn(),
    } as unknown as ImportDiscoveryItemRepository
    importStrategyFactory = {
      create: vi.fn(),
    } as unknown as ImportStrategyFactory

    useCase = new RefreshImportDiscoveryUseCase(
      importDiscoveryRepository,
      importDiscoveryItemRepository,
      importStrategyFactory,
    )
  })

  it('should create a new discovery snapshot with selection carry-over and diff', async () => {
    // Arrange
    vi.mocked(importDiscoveryRepository.findOne).mockResolvedValue({
      id: 'discovery-1',
      dataSource: 'youtube',
      sourceRef: 'https://youtube.com/playlist?list=abc',
      label: 'Old List',
    } as never)
    vi.mocked(importDiscoveryItemRepository.findMany).mockResolvedValue([
      {
        id: 'old-1',
        discoveryId: 'discovery-1',
        sourceItemRef: 'a',
        label: 'Track A',
        position: 0,
        isSelected: true,
      },
      {
        id: 'old-2',
        discoveryId: 'discovery-1',
        sourceItemRef: 'b',
        label: 'Track B',
        position: 1,
        isSelected: false,
      },
    ] as never)
    vi.mocked(importStrategyFactory.create).mockReturnValue({
      method: {
        key: 'youtube',
        name: 'YouTube',
        description: 'Import from YouTube.',
      },
      normalizeSourceRef: vi.fn((sourceRef) => sourceRef),
      normalizeSourceItemRef: vi.fn((sourceItemRef) => sourceItemRef),
      validateSourceRef: vi.fn(),
      discoverTracks: vi.fn().mockResolvedValue({
        sourceRef: 'https://youtube.com/playlist?list=abc',
        label: 'New List',
        tracks: [
          { sourceItemRef: 'a', label: 'Track A' },
          { sourceItemRef: 'c', label: 'Track C' },
        ],
      }),
      ingestTrack: vi.fn(),
    } as never)
    vi.mocked(importDiscoveryRepository.create).mockResolvedValue({
      id: 'discovery-2',
      dataSource: 'youtube',
      sourceRef: 'https://youtube.com/playlist?list=abc',
      label: 'New List',
    } as never)
    vi.mocked(importDiscoveryItemRepository.createMany).mockResolvedValue([
      {
        id: 'new-1',
        discoveryId: 'discovery-2',
        sourceItemRef: 'a',
        label: 'Track A',
        position: 0,
        isSelected: true,
      },
      {
        id: 'new-2',
        discoveryId: 'discovery-2',
        sourceItemRef: 'c',
        label: 'Track C',
        position: 1,
        isSelected: false,
      },
    ] as never)

    // Act
    const result = await useCase.invoke({
      discoveryId: 'discovery-1',
      userId: 'user-1',
    })

    // Assert
    expect(importDiscoveryItemRepository.createMany).toHaveBeenCalledWith([
      {
        discoveryId: 'discovery-2',
        sourceItemRef: 'a',
        label: 'Track A',
        position: 0,
        isSelected: true,
      },
      {
        discoveryId: 'discovery-2',
        sourceItemRef: 'c',
        label: 'Track C',
        position: 1,
        isSelected: false,
      },
    ])
    expect(result.newSourceItemRefs).toEqual(['c'])
    expect(result.removedSourceItemRefs).toEqual(['b'])
  })

  it('should throw when discovery does not exist', async () => {
    // Arrange
    vi.mocked(importDiscoveryRepository.findOne).mockResolvedValue(undefined)

    // Act & Assert
    await expect(
      useCase.invoke({
        discoveryId: 'missing',
        userId: 'user-1',
      }),
    ).rejects.toThrow(NotFoundException)
  })
})
