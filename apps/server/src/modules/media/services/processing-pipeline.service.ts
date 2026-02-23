import { Inject, Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { MEDIA_MODULE_OPTIONS } from '../tokens'
import { MediaModuleOptions } from '../types'
import { MediaRepository } from '../repositories'
import { ProcessingStatus, ProcessingStep } from '../enums'
import { ImageService } from './image.service'

import { ProcessingJobTable, ProcessingStepTable } from '@/modules/database/schemas/media.schema'

interface Job extends Selectable<ProcessingJobTable> {
  steps: Selectable<ProcessingStepTable>[]
}

@Injectable()
export class ProcessingPipelineService {
  private readonly maxConcurrentProcessingJobs: number
  private readonly processingJobs = new Map<string, Job>()

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly mediaRepository: MediaRepository,
    private readonly imageService: ImageService,
  ) {
    this.maxConcurrentProcessingJobs = options.maxConcurrentProcessingJobs
  }

  next(): void {
    if (this.processingJobs.size >= this.maxConcurrentProcessingJobs) {
      return
    }

    void this.processNextJob()
  }

  async processNextJob(): Promise<void> {
    const job = await this.getPendingJob()

    if (!job || this.processingJobs.size >= this.maxConcurrentProcessingJobs) {
      return
    }

    this.processingJobs.set(job.id, job)

    try {
      await this.processJob(job)
    } finally {
      this.processingJobs.delete(job.id)
      this.next()
    }
  }

  async processJob(job: Job): Promise<void> {
    job.status = ProcessingStatus.PROCESSING
    job.startedAt = new Date()

    await this.mediaRepository.updateProcessingJob(job)

    try {
      for (const step of job.steps) {
        if (step.status !== ProcessingStatus.PENDING) {
          continue
        }

        await this.processStep(step, job.sourceAssetId)
      }

      job.status = ProcessingStatus.COMPLETED
      job.completedAt = new Date()

      await this.mediaRepository.updateProcessingJob(job)
    } catch {
      job.status = ProcessingStatus.FAILED
      job.completedAt = new Date()

      await this.mediaRepository.updateProcessingJob(job)
    }
  }

  async processStep(step: Selectable<ProcessingStepTable>, sourceAssetId: string): Promise<void> {
    step.status = ProcessingStatus.PROCESSING
    step.startedAt = new Date()

    await this.mediaRepository.updateProcessingStep(step)

    try {
      switch (step.name) {
        case ProcessingStep.IMAGE_TRANSFORMATION:
          await this.imageService.transform(sourceAssetId)
          break
        case ProcessingStep.AUDIO_TRANSFORMATION:
          // return this.processTransformation(step)
          break
        default:
          throw new Error(`Unknown processing step: ${step.name as string}`)
      }

      step.status = ProcessingStatus.COMPLETED
      step.completedAt = new Date()

      await this.mediaRepository.updateProcessingStep(step)
    } catch (error) {
      step.status = ProcessingStatus.FAILED
      step.errorMessage = error instanceof Error ? error.message : 'Unknown error'
      step.completedAt = new Date()

      await this.mediaRepository.updateProcessingStep(step)
      throw error
    }
  }

  async getPendingJob(): Promise<Job | undefined> {
    const job = await this.mediaRepository.findPendingProcessingJob()

    if (!job) {
      return
    }

    const steps = await this.mediaRepository.findProcessingStepsByJobId(job.id)

    return {
      ...job,
      steps,
    }
  }
}
