import { Injectable } from '@nestjs/common'

import { ProcessingJobRepository, ProcessingPipelineRepository } from '../repositories'
import { ImageService } from './image.service'
import { ProcessingJob, ProcessingStatus } from '../enums'
import { AudioService } from './audio.service'

@Injectable()
export class MediaProcessingService {
  private processing = false
  private readonly maxFailedAttempts = 3

  constructor(
    private readonly processingPipelineRepository: ProcessingPipelineRepository,
    private readonly processingJobRepository: ProcessingJobRepository,
    private readonly imageService: ImageService,
    private readonly audioService: AudioService,
  ) {}

  next(): void {
    if (this.processing) {
      return
    }

    void this.processMedia()
  }

  async processMedia(): Promise<void> {
    this.processing = true

    const pipeline = await this.processingPipelineRepository.findOneByStatus(ProcessingStatus.PENDING)

    if (!pipeline) {
      this.processing = false
      return
    }

    const updatedPipeline = {
      ...pipeline,
      status: ProcessingStatus.PROCESSING,
      startedAt: new Date(),
    }

    await this.processingPipelineRepository.update({
      ...pipeline,
      status: ProcessingStatus.PROCESSING,
      startedAt: new Date(),
    })

    try {
      const jobs = await this.processingJobRepository.findMany(pipeline.id)

      const jobToProcess = jobs.find((job) => job.status === ProcessingStatus.PENDING)

      if (!jobToProcess) {
        throw new Error('No job to process in pending pipeline')
      }

      const updatedJob = {
        ...jobToProcess,
        status: ProcessingStatus.PROCESSING,
        startedAt: new Date(),
      }

      await this.processingJobRepository.update(updatedJob)

      const currentAttempts = jobToProcess.attempts ?? 0

      try {
        switch (jobToProcess.jobName) {
          case ProcessingJob.IMAGE_TRANSFORM:
            await this.imageService.transform(pipeline.sourceId)
            break
          case ProcessingJob.IMAGE_ANALYZE:
            await this.imageService.analyze(pipeline.sourceId)
            break
          case ProcessingJob.AUDIO_TRANSFORM:
            await this.audioService.transform(pipeline.sourceId)
            break
          default:
            throw new Error(`Unknown job name: ${jobToProcess.jobName as string}`)
        }

        // Job succeeded - mark as completed
        await this.processingJobRepository.update({
          ...updatedJob,
          status: ProcessingStatus.COMPLETED,
          completedAt: new Date(),
          attempts: currentAttempts + 1,
        })

        const lastJobCompleted = jobs.filter((job) => job.status === ProcessingStatus.PENDING).length === 1

        if (lastJobCompleted) {
          await this.processingPipelineRepository.update({
            ...updatedPipeline,
            status: ProcessingStatus.COMPLETED,
            completedAt: new Date(),
          })
        } else {
          await this.processingPipelineRepository.update({
            ...updatedPipeline,
            status: ProcessingStatus.PENDING,
          })
        }
      } catch (jobError) {
        const newAttempts = currentAttempts + 1
        const errorMessage = jobError instanceof Error ? jobError.message : 'Unknown error'

        if (newAttempts >= this.maxFailedAttempts) {
          // Max attempts reached - mark job as failed
          await this.processingJobRepository.update({
            ...jobToProcess,
            status: ProcessingStatus.FAILED,
            attempts: newAttempts,
            errorMessage,
            completedAt: new Date(),
          })

          // Mark entire pipeline as failed
          await this.processingPipelineRepository.update({
            ...pipeline,
            status: ProcessingStatus.FAILED,
            completedAt: new Date(),
          })
        } else {
          // Retry available - update attempts and keep as pending
          await this.processingJobRepository.update({
            ...updatedJob,
            status: ProcessingStatus.PENDING,
            attempts: newAttempts,
            errorMessage,
          })

          // Reset pipeline to pending for retry
          await this.processingPipelineRepository.update({
            ...updatedPipeline,
            status: ProcessingStatus.PENDING,
          })
        }
      }
    } catch {
      await this.processingPipelineRepository.update({
        ...updatedPipeline,
        status: ProcessingStatus.FAILED,
        completedAt: new Date(),
      })
    } finally {
      this.processing = false
      this.next()
    }
  }
}
