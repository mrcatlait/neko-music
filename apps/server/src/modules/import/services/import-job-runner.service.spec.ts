import { ImportJobRunnerService } from './import-job-runner.service'
import { ImportStatus } from '../enums'
import { ImportJobItemRepository, ImportJobRepository } from '../repositories'

describe('ImportJobRunnerService', () => {
  let service: ImportJobRunnerService
  let importJobRepository: ImportJobRepository
  let importJobItemRepository: ImportJobItemRepository
  let importJobItemRunnerService: { run: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    importJobRepository = {
      update: vi.fn(),
      findOne: vi.fn(),
    } as unknown as ImportJobRepository
    importJobItemRepository = {
      findMany: vi.fn(),
      findPendingOrInProgressByJobId: vi.fn(),
    } as unknown as ImportJobItemRepository
    importJobItemRunnerService = {
      run: vi.fn(),
    }

    service = new ImportJobRunnerService(
      importJobRepository,
      importJobItemRepository,
      importJobItemRunnerService as never,
    )
  })

  it('should stop scheduling new items after cancel is requested and mark job canceled', async () => {
    // Arrange
    vi.mocked(importJobItemRepository.findPendingOrInProgressByJobId).mockResolvedValue([
      { id: 'item-1', sourceItemRef: 'ref-1', status: ImportStatus.Pending },
      { id: 'item-2', sourceItemRef: 'ref-2', status: ImportStatus.Pending },
    ] as never)
    vi.mocked(importJobItemRepository.findMany)
      .mockResolvedValueOnce([
        { id: 'item-1', status: ImportStatus.Completed },
        { id: 'item-2', status: ImportStatus.Pending },
      ] as never)
    vi.mocked(importJobRepository.findOne)
      .mockResolvedValueOnce({ id: 'job-1', status: ImportStatus.InProgress } as never)
      .mockResolvedValueOnce({ id: 'job-1', status: ImportStatus.CancelRequested } as never)

    // Act
    await service.run({
      jobId: 'job-1',
      dataSource: 'youtube',
      userId: 'user-1',
    })

    // Assert
    expect(importJobItemRunnerService.run).toHaveBeenCalledTimes(1)
    expect(importJobItemRunnerService.run).toHaveBeenCalledWith({
      jobItemId: 'item-1',
      sourceItemRef: 'ref-1',
      dataSource: 'youtube',
      userId: 'user-1',
    })
    expect(importJobRepository.update).toHaveBeenNthCalledWith(
      1,
      'job-1',
      expect.objectContaining({
        status: ImportStatus.InProgress,
      }),
    )
    expect(importJobRepository.update).toHaveBeenNthCalledWith(
      2,
      'job-1',
      expect.objectContaining({
        status: ImportStatus.Canceled,
      }),
    )
  })

  it('should resume interrupted in_progress items on next run', async () => {
    // Arrange
    vi.mocked(importJobItemRepository.findPendingOrInProgressByJobId).mockResolvedValue([
      { id: 'item-1', sourceItemRef: 'ref-1', status: ImportStatus.InProgress },
    ] as never)
    vi.mocked(importJobItemRepository.findMany).mockResolvedValue([
      { id: 'item-1', status: ImportStatus.Completed },
    ] as never)
    vi.mocked(importJobRepository.findOne).mockResolvedValue({ id: 'job-1', status: ImportStatus.InProgress } as never)

    // Act
    await service.run({
      jobId: 'job-1',
      dataSource: 'youtube',
      userId: 'user-1',
    })

    // Assert
    expect(importJobItemRunnerService.run).toHaveBeenCalledWith({
      jobItemId: 'item-1',
      sourceItemRef: 'ref-1',
      dataSource: 'youtube',
      userId: 'user-1',
    })
  })
})
