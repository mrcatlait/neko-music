import { GetImportJobsUseCase } from './get-import-jobs.use-case'
import { ImportStatus } from '../../enums'
import { ImportJobItemRepository, ImportJobRepository, MetadataClaimReviewRepository } from '../../repositories'

describe('GetImportJobsUseCase', () => {
  it('should return import jobs with computed counters', async () => {
    // Arrange
    const importJobRepository = {
      findRecent: vi.fn().mockResolvedValue([
        {
          id: 'job-1',
          dataSource: 'youtube',
          sourceRef: 'https://www.youtube.com/playlist?list=abc',
          label: 'My playlist',
          status: ImportStatus.InProgress,
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
          startedAt: new Date('2026-01-01T00:01:00.000Z'),
          completedAt: null,
        },
      ]),
    } as unknown as ImportJobRepository
    const importJobItemRepository = {
      findMany: vi.fn().mockResolvedValue([
        { id: 'item-1', status: ImportStatus.Completed },
        { id: 'item-2', status: ImportStatus.Failed },
        { id: 'item-3', status: ImportStatus.Pending },
      ]),
    } as unknown as ImportJobItemRepository
    const metadataClaimReviewRepository = {
      countPendingByJobId: vi.fn().mockResolvedValue(2),
    } as unknown as MetadataClaimReviewRepository
    const useCase = new GetImportJobsUseCase(
      importJobRepository,
      importJobItemRepository,
      metadataClaimReviewRepository,
    )

    // Act
    const result = await useCase.invoke()

    // Assert
    expect(result).toEqual([
      expect.objectContaining({
        id: 'job-1',
        totalItems: 3,
        completedItems: 1,
        failedItems: 1,
        pendingReviewItems: 2,
        progressPercent: 67,
      }),
    ])
  })
})
