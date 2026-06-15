import { ImportRunnerService } from './import-runner.service'
import { ImportJobRepository } from '../repositories'
import { ImportJobRunnerService } from './import-job-runner.service'
import { ImportStatus } from '../enums'

describe('ImportRunnerService', () => {
  it('should respect per-source concurrency caps', async () => {
    // Arrange
    const runnableJobs = [
      { id: 'job-1', dataSource: 'youtube', createdBy: 'user-1', status: ImportStatus.Pending, createdAt: new Date() },
      { id: 'job-2', dataSource: 'youtube', createdBy: 'user-1', status: ImportStatus.Pending, createdAt: new Date() },
      { id: 'job-3', dataSource: 'filesystem', createdBy: 'user-1', status: ImportStatus.Pending, createdAt: new Date() },
    ]
    const importJobRepository = {
      findRunnableImportJobs: vi
        .fn()
        .mockResolvedValueOnce(runnableJobs)
        .mockResolvedValueOnce(runnableJobs)
        .mockResolvedValue([]),
    } as unknown as ImportJobRepository
    const run = vi.fn().mockResolvedValue(undefined)
    const importJobRunnerService = {
      run,
    } as unknown as ImportJobRunnerService
    const service = new ImportRunnerService(
      {
        importStrategies: [],
        maxConcurrentJobs: 3,
        maxConcurrentJobsPerSource: {
          youtube: 1,
        },
      },
      importJobRepository,
      importJobRunnerService,
    )

    // Act
    service.next()
    await new Promise((resolve) => setTimeout(resolve, 0))

    // Assert
    expect(run).toHaveBeenCalledTimes(2)
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ jobId: 'job-1' }))
    expect(run).toHaveBeenCalledWith(expect.objectContaining({ jobId: 'job-3' }))
    expect(run).not.toHaveBeenCalledWith(expect.objectContaining({ jobId: 'job-2' }))
  })
})
