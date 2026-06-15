import { Injectable, Logger } from '@nestjs/common'

import { ImportJobItemRepository, ImportJobRepository } from '../repositories'
import { ImportJobItemRunnerService } from './import-job-item-runner.service'
import { ImportStatus } from '../enums'

interface JobContext {
  jobId: string
  dataSource: string
  userId: string
}

@Injectable()
export class ImportJobRunnerService {
  private readonly logger = new Logger(ImportJobRunnerService.name)

  constructor(
    private readonly importJobRepository: ImportJobRepository,
    private readonly importJobItemRepository: ImportJobItemRepository,
    private readonly importJobItemRunnerService: ImportJobItemRunnerService,
  ) {}

  async run(ctx: JobContext): Promise<void> {
    await this.importJobRepository.update(ctx.jobId, {
      status: ImportStatus.InProgress,
      startedAt: new Date(),
    })

    const items = await this.importJobItemRepository.findPendingOrInProgressByJobId(ctx.jobId)

    let cancelRequested = false

    for (const item of items) {
      const job = await this.importJobRepository.findOne(ctx.jobId)

      if (job?.status === ImportStatus.CancelRequested) {
        cancelRequested = true
        break
      }

      try {
        await this.importJobItemRunnerService.run({
          jobItemId: item.id,
          sourceItemRef: item.sourceItemRef,
          dataSource: ctx.dataSource,
          userId: ctx.userId,
        })
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        this.logger.warn(`Import job item ${item.id} (${item.sourceItemRef}) failed: ${message}`)
      }
    }

    const jobItems = await this.importJobItemRepository.findMany({
      jobId: ctx.jobId,
    })

    const completedCount = jobItems.filter((item) => item.status === ImportStatus.Completed).length
    const failedCount = jobItems.filter((item) => item.status === ImportStatus.Failed).length
    const pendingCount = jobItems.filter((item) => item.status === ImportStatus.Pending).length

    const jobStatus =
      cancelRequested && pendingCount > 0
        ? ImportStatus.Canceled
        : completedCount === 0 && failedCount > 0
          ? ImportStatus.Failed
          : ImportStatus.Completed

    await this.importJobRepository.update(ctx.jobId, {
      status: jobStatus,
      completedAt: new Date(),
    })

    this.logger.log(`Import job ${ctx.jobId} finished (${completedCount} completed, ${failedCount} failed)`)
  }
}
