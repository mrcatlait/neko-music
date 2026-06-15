import { BadRequestException, NotFoundException } from '@nestjs/common'

import { StartImportFromDiscoveryUseCase } from './start-import-from-discovery.use-case'
import { ImportStatus } from '../../enums'
import { ImportDiscoveryItemRepository, ImportDiscoveryRepository, ImportJobItemRepository, ImportJobRepository } from '../../repositories'

describe('StartImportFromDiscoveryUseCase', () => {
  let useCase: StartImportFromDiscoveryUseCase
  let importDiscoveryRepository: ImportDiscoveryRepository
  let importDiscoveryItemRepository: ImportDiscoveryItemRepository
  let importJobRepository: ImportJobRepository
  let importJobItemRepository: ImportJobItemRepository

  beforeEach(() => {
    importDiscoveryRepository = {
      findOne: vi.fn(),
    } as unknown as ImportDiscoveryRepository
    importDiscoveryItemRepository = {
      findMany: vi.fn(),
      setSelection: vi.fn(),
    } as unknown as ImportDiscoveryItemRepository
    importJobRepository = {
      findByDiscoveryId: vi.fn(),
      create: vi.fn(),
    } as unknown as ImportJobRepository
    importJobItemRepository = {
      createMany: vi.fn(),
      findExistingCanonicalRefs: vi.fn().mockResolvedValue(new Set()),
    } as unknown as ImportJobItemRepository

    useCase = new StartImportFromDiscoveryUseCase(
      importDiscoveryRepository,
      importDiscoveryItemRepository,
      importJobRepository,
      importJobItemRepository,
      {
        importStrategies: [],
        discoveryTtlDays: 7,
      },
    )
  })

  it('should return existing import job when discovery was already started', async () => {
    // Arrange
    vi.mocked(importJobRepository.findByDiscoveryId).mockResolvedValue({
      id: 'job-1',
    } as never)

    // Act
    const result = await useCase.invoke({
      discoveryId: 'discovery-1',
      selectedItemIds: ['item-1'],
      userId: 'user-1',
    })

    // Assert
    expect(result).toEqual({ id: 'job-1' })
    expect(importJobRepository.create).not.toHaveBeenCalled()
    expect(importDiscoveryItemRepository.setSelection).not.toHaveBeenCalled()
  })

  it('should create import job from selected discovery items', async () => {
    // Arrange
    vi.mocked(importJobRepository.findByDiscoveryId).mockResolvedValue(undefined)
    vi.mocked(importDiscoveryRepository.findOne).mockResolvedValue({
      id: 'discovery-1',
      dataSource: 'youtube',
      sourceRef: 'https://youtu.be/dQw4w9WgXcQ',
      label: 'Discovery Label',
      createdAt: new Date(),
    } as never)
    vi.mocked(importDiscoveryItemRepository.findMany).mockResolvedValue([
      {
        id: 'item-1',
        sourceItemRef: 'dQw4w9WgXcQ',
        label: 'Track 1',
      },
      {
        id: 'item-2',
        sourceItemRef: 'xvFZjo5PgG0',
        label: 'Track 2',
      },
    ] as never)
    vi.mocked(importJobRepository.create).mockResolvedValue({
      id: 'job-1',
    } as never)

    // Act
    const result = await useCase.invoke({
      discoveryId: 'discovery-1',
      selectedItemIds: ['item-2'],
      userId: 'user-1',
    })

    // Assert
    expect(importDiscoveryItemRepository.setSelection).toHaveBeenCalledWith('discovery-1', ['item-2'])
    expect(importJobRepository.create).toHaveBeenCalledWith({
      discoveryId: 'discovery-1',
      dataSource: 'youtube',
      sourceRef: 'https://youtu.be/dQw4w9WgXcQ',
      status: ImportStatus.Pending,
      label: 'Discovery Label',
      createdBy: 'user-1',
    })
    expect(importJobItemRepository.createMany).toHaveBeenCalledWith([
      {
        jobId: 'job-1',
        status: ImportStatus.Pending,
        sourceItemRef: 'xvFZjo5PgG0',
        label: 'Track 2',
        errorMessage: null,
      },
    ])
    expect(result).toEqual({ id: 'job-1' })
  })

  it('should mark hard duplicate items as completed', async () => {
    // Arrange
    vi.mocked(importJobRepository.findByDiscoveryId).mockResolvedValue(undefined)
    vi.mocked(importDiscoveryRepository.findOne).mockResolvedValue({
      id: 'discovery-1',
      dataSource: 'youtube',
      sourceRef: 'https://youtu.be/dQw4w9WgXcQ',
      label: 'Discovery Label',
      createdAt: new Date(),
    } as never)
    vi.mocked(importDiscoveryItemRepository.findMany).mockResolvedValue([
      {
        id: 'item-1',
        sourceItemRef: 'dQw4w9WgXcQ',
        label: 'Track 1',
      },
    ] as never)
    vi.mocked(importJobRepository.create).mockResolvedValue({
      id: 'job-1',
    } as never)
    vi.mocked(importJobItemRepository.findExistingCanonicalRefs).mockResolvedValue(new Set(['dQw4w9WgXcQ']))

    // Act
    await useCase.invoke({
      discoveryId: 'discovery-1',
      selectedItemIds: ['item-1'],
      userId: 'user-1',
    })

    // Assert
    expect(importJobItemRepository.createMany).toHaveBeenCalledWith([
      {
        jobId: 'job-1',
        status: ImportStatus.Completed,
        sourceItemRef: 'dQw4w9WgXcQ',
        label: 'Track 1',
        errorMessage: 'hard_duplicate',
      },
    ])
  })

  it('should throw when discovery does not exist', async () => {
    // Arrange
    vi.mocked(importJobRepository.findByDiscoveryId).mockResolvedValue(undefined)
    vi.mocked(importDiscoveryRepository.findOne).mockResolvedValue(undefined)

    // Act & Assert
    await expect(
      useCase.invoke({
        discoveryId: 'missing',
        selectedItemIds: ['item-1'],
        userId: 'user-1',
      }),
    ).rejects.toThrow(NotFoundException)
  })

  it('should throw when selected item ids contain unknown item', async () => {
    // Arrange
    vi.mocked(importJobRepository.findByDiscoveryId).mockResolvedValue(undefined)
    vi.mocked(importDiscoveryRepository.findOne).mockResolvedValue({
      id: 'discovery-1',
      dataSource: 'youtube',
      sourceRef: 'https://youtu.be/dQw4w9WgXcQ',
      label: 'Discovery Label',
      createdAt: new Date(),
    } as never)
    vi.mocked(importDiscoveryItemRepository.findMany).mockResolvedValue([
      {
        id: 'item-1',
        sourceItemRef: 'dQw4w9WgXcQ',
        label: 'Track 1',
      },
    ] as never)

    // Act & Assert
    await expect(
      useCase.invoke({
        discoveryId: 'discovery-1',
        selectedItemIds: ['item-2'],
        userId: 'user-1',
      }),
    ).rejects.toThrow(BadRequestException)
  })

  it('should throw when discovery has expired', async () => {
    // Arrange
    vi.mocked(importJobRepository.findByDiscoveryId).mockResolvedValue(undefined)
    const oldDate = new Date()
    oldDate.setDate(oldDate.getDate() - 10)
    vi.mocked(importDiscoveryRepository.findOne).mockResolvedValue({
      id: 'discovery-1',
      dataSource: 'youtube',
      sourceRef: 'https://youtu.be/dQw4w9WgXcQ',
      label: 'Discovery Label',
      createdAt: oldDate,
    } as never)

    // Act & Assert
    await expect(
      useCase.invoke({
        discoveryId: 'discovery-1',
        selectedItemIds: ['item-1'],
        userId: 'user-1',
      }),
    ).rejects.toThrow(BadRequestException)
  })
})
