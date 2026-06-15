import { Inject, Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { MEDIA_MODULE_OPTIONS } from '../tokens'
import { MediaModuleOptions } from '../types'
import { MediaRepository } from '../repositories'
import { ProcessingJobRunnerService } from './processing-job-runner.service'
import { ProcessingJobTable } from '../media.schema'

@Injectable()
export class ProcessingRunnerService {
  private readonly maxConcurrentJobs: number
  private readonly activeJobs = new Map<string, Selectable<ProcessingJobTable>>()

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly mediaRepository: MediaRepository,
    private readonly processingJobRunnerService: ProcessingJobRunnerService,
  ) {
    this.maxConcurrentJobs = options.maxConcurrentProcessingJobs
  }

  isRunning(jobId: string): boolean {
    return this.activeJobs.has(jobId)
  }

  hasCapacity(): boolean {
    return this.activeJobs.size < this.maxConcurrentJobs
  }

  next(): void {
    if (!this.hasCapacity()) {
      return
    }

    void this.processNextJob()
  }

  async processNextJob(): Promise<void> {
    const job = await this.mediaRepository.findPendingProcessingJob()

    if (!job) {
      return
    }

    if (this.isRunning(job.id)) {
      return
    }

    this.activeJobs.set(job.id, job)

    try {
      await this.processingJobRunnerService.run({
        jobId: job.id,
        sourceAssetId: job.sourceAssetId,
      })
    } finally {
      this.activeJobs.delete(job.id)
      this.next()
    }
  }
}
