import { Inject, Injectable, Logger } from '@nestjs/common'
import { Selectable } from 'kysely'

import { ImportJobRepository } from '../repositories'
import { ImportJobTable } from '../import.schema'
import { ImportJobRunnerService } from './import-job-runner.service'
import { IMPORT_MODULE_OPTIONS } from '../tokens'
import { ImportModuleOptions } from '../module-options'

@Injectable()
export class ImportRunnerService {
  private readonly logger = new Logger(ImportRunnerService.name)
  private readonly activeJobs = new Map<string, Selectable<ImportJobTable>>()
  private isScheduling = false

  constructor(
    @Inject(IMPORT_MODULE_OPTIONS)
    private readonly importModuleOptions: ImportModuleOptions,
    private readonly importJobRepository: ImportJobRepository,
    private readonly importJobRunnerService: ImportJobRunnerService,
  ) {}

  isRunning(jobId: string): boolean {
    return this.activeJobs.has(jobId)
  }

  hasCapacityFor(dataSource: string): boolean {
    const maxConcurrentJobs = this.importModuleOptions.maxConcurrentJobs ?? 1
    const maxConcurrentJobsPerSource = this.importModuleOptions.maxConcurrentJobsPerSource ?? {}
    const sourceCap = maxConcurrentJobsPerSource[dataSource] ?? maxConcurrentJobs
    const activeSourceCount = [...this.activeJobs.values()].filter((job) => job.dataSource === dataSource).length

    return this.activeJobs.size < maxConcurrentJobs && activeSourceCount < sourceCap
  }

  next(): void {
    if (this.isScheduling) {
      return
    }

    this.isScheduling = true

    void this.fillCapacity().finally(() => {
      this.isScheduling = false
    })
  }

  private async fillCapacity(): Promise<void> {
    const maxConcurrentJobs = this.importModuleOptions.maxConcurrentJobs ?? 1

    while (this.activeJobs.size < maxConcurrentJobs) {
      const runnableJobs = await this.importJobRepository.findRunnableImportJobs(50)
      const nextJob = runnableJobs.find((job) => !this.isRunning(job.id) && this.hasCapacityFor(job.dataSource))

      if (!nextJob) {
        break
      }

      this.runJob(nextJob)
    }
  }

  private runJob(job: Selectable<ImportJobTable>): void {
    this.activeJobs.set(job.id, job)

    void this.importJobRunnerService
      .run({
        jobId: job.id,
        dataSource: job.dataSource,
        userId: job.createdBy,
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : 'Unknown error'
        this.logger.error(`Import job ${job.id} failed unexpectedly: ${message}`, error)
      })
      .finally(() => {
        this.activeJobs.delete(job.id)
        this.next()
      })
  }
}
