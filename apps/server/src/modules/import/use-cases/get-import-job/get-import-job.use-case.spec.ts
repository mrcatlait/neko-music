import { NotFoundException } from '@nestjs/common'

import { GetImportJobUseCase } from './get-import-job.use-case'
import { ImportStatus } from '../../enums'
import { ImportJobItemRepository, ImportJobRepository, MetadataClaimReviewRepository } from '../../repositories'

describe('GetImportJobUseCase', () => {
  it('should throw when import job does not exist', async () => {
    // Arrange
    const importJobRepository = {
      findOne: vi.fn().mockResolvedValue(undefined),
    } as unknown as ImportJobRepository
    const importJobItemRepository = {
      findMany: vi.fn(),
    } as unknown as ImportJobItemRepository
    const metadataClaimReviewRepository = {
      countPendingByJobId: vi.fn(),
    } as unknown as MetadataClaimReviewRepository
    const useCase = new GetImportJobUseCase(importJobRepository, importJobItemRepository, metadataClaimReviewRepository)

    // Act & Assert
    await expect(useCase.invoke({ id: 'missing' })).rejects.toThrow(NotFoundException)
  })

  it('should return import job details with items and counters', async () => {
    // Arrange
    const importJobRepository = {
      findOne: vi.fn().mockResolvedValue({
        id: 'job-1',
        dataSource: 'youtube',
        sourceRef: 'https://www.youtube.com/playlist?list=abc',
        label: 'My playlist',
        status: ImportStatus.Completed,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
        startedAt: new Date('2026-01-01T00:01:00.000Z'),
        completedAt: new Date('2026-01-01T00:03:00.000Z'),
      }),
    } as unknown as ImportJobRepository
    const importJobItemRepository = {
      findMany: vi.fn().mockResolvedValue([
        { id: 'item-1', sourceItemRef: 'a', label: 'Track A', status: ImportStatus.Completed },
        { id: 'item-2', sourceItemRef: 'b', label: 'Track B', status: ImportStatus.Failed },
      ]),
    } as unknown as ImportJobItemRepository
    const metadataClaimReviewRepository = {
      countPendingByJobId: vi.fn().mockResolvedValue(1),
    } as unknown as MetadataClaimReviewRepository
    const useCase = new GetImportJobUseCase(importJobRepository, importJobItemRepository, metadataClaimReviewRepository)

    // Act
    const result = await useCase.invoke({ id: 'job-1' })

    // Assert
    expect(result).toEqual(
      expect.objectContaining({
        id: 'job-1',
        totalItems: 2,
        completedItems: 1,
        failedItems: 1,
        pendingReviewItems: 1,
        progressPercent: 100,
      }),
    )
    expect(result.items).toHaveLength(2)
  })
})
