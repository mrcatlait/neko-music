import { Inject, Injectable, Logger } from '@nestjs/common'
import { Selectable } from 'kysely'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { MEDIA_MODULE_OPTIONS } from '../tokens'
import { MediaModuleOptions } from '../types'
import { MediaRepository, SourceAssetRepository } from '../repositories'
import { ProcessingStatus, ProcessingStep } from '../enums'
import { ImageService } from './image.service'
import { ProcessingJobTable, ProcessingStepTable } from '../media.schema'
import { AudioService } from './audio.service'

import {
  MediaProcessingCompletedEvent,
  MediaProcessingFailedEvent,
  MediaProcessingStartedEvent,
} from '@/modules/shared/events'

interface Job extends Selectable<ProcessingJobTable> {
  steps: Selectable<ProcessingStepTable>[]
}

@Injectable()
export class ProcessingPipelineService {
  private readonly logger = new Logger(this.constructor.name)

  private readonly maxConcurrentProcessingJobs: number
  private readonly processingJobs = new Map<string, Job>()

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly mediaRepository: MediaRepository,
    private readonly sourceAssetRepository: SourceAssetRepository,
    private readonly imageService: ImageService,
    private readonly audioService: AudioService,
    private readonly eventEmitter: EventEmitter2,
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
    job.status = ProcessingStatus.Processing
    job.startedAt = new Date()

    await this.mediaRepository.updateProcessingJob(job)

    const sourceAsset = await this.sourceAssetRepository.findOne(job.sourceAssetId)

    if (!sourceAsset) {
      throw new Error('Source asset not found')
    }

    this.eventEmitter.emit(
      MediaProcessingStartedEvent.event,
      new MediaProcessingStartedEvent({
        entityType: sourceAsset.entityType,
        entityId: sourceAsset.entityId,
      }),
    )

    try {
      for (const step of job.steps) {
        if (step.status !== ProcessingStatus.Pending) {
          continue
        }

        await this.processStep(step, job.sourceAssetId)
      }

      job.status = ProcessingStatus.Completed
      job.completedAt = new Date()

      await this.mediaRepository.updateProcessingJob(job)

      this.eventEmitter.emit(
        MediaProcessingCompletedEvent.event,
        new MediaProcessingCompletedEvent({
          sourceAssetId: sourceAsset.id,
          entityType: sourceAsset.entityType,
          entityId: sourceAsset.entityId,
        }),
      )
    } catch {
      job.status = ProcessingStatus.Failed
      job.completedAt = new Date()

      await this.mediaRepository.updateProcessingJob(job)

      this.eventEmitter.emit(
        MediaProcessingFailedEvent.event,
        new MediaProcessingFailedEvent({
          entityType: sourceAsset.entityType,
          entityId: sourceAsset.entityId,
        }),
      )
    }
  }

  async processStep(step: Selectable<ProcessingStepTable>, sourceAssetId: string): Promise<void> {
    step.status = ProcessingStatus.Processing
    step.startedAt = new Date()

    await this.mediaRepository.updateProcessingStep(step)

    try {
      switch (step.name) {
        case ProcessingStep.ImageTransformation: {
          await this.imageService.transform(sourceAssetId)
          break
        }
        case ProcessingStep.AudioTransformation:
          await this.audioService.transform(sourceAssetId)
          break
        default:
          throw new Error(`Unknown processing step: ${step.name as string}`)
      }

      step.status = ProcessingStatus.Completed
      step.completedAt = new Date()

      await this.mediaRepository.updateProcessingStep(step)
    } catch (error) {
      this.logger.error(error)
      step.status = ProcessingStatus.Failed
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const shortErrorMessage = errorMessage.length > 255 ? errorMessage.slice(0, 255) : errorMessage
      step.errorMessage = shortErrorMessage
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
