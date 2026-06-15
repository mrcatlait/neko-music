import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { ProcessingJobItemRepository, ProcessingJobRepository, SourceAssetRepository } from '../repositories'
import { ProcessingStatus } from '../enums'
import { MediaProcessingCompletedEvent } from '../events'
import { ProcessingJobItemRunnerService } from './processing-job-item-runner.service'

interface JobContext {
  jobId: string
  sourceAssetId: string
}

@Injectable()
export class ProcessingJobRunnerService {
  constructor(
    private readonly processingJobRepository: ProcessingJobRepository,
    private readonly processingJobItemRepository: ProcessingJobItemRepository,
    private readonly sourceAssetRepository: SourceAssetRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly processingJobItemRunnerService: ProcessingJobItemRunnerService,
  ) {}

  async run(ctx: JobContext): Promise<void> {
    await this.processingJobRepository.update(ctx.jobId, {
      status: ProcessingStatus.Processing,
      startedAt: new Date(),
    })

    const sourceAsset = await this.sourceAssetRepository.findOne(ctx.sourceAssetId)

    if (!sourceAsset) {
      throw new Error('Source asset not found')
    }

    try {
      const steps = await this.processingJobItemRepository.findMany({
        jobId: ctx.jobId,
      })

      for (const step of steps) {
        if (step.status !== ProcessingStatus.Pending) {
          continue
        }

        await this.processingJobItemRunnerService.run({
          jobItemId: step.id,
          name: step.name,
          sourceAssetId: ctx.sourceAssetId,
        })
      }
    } catch (error) {
      await this.processingJobRepository.update(ctx.jobId, {
        status: ProcessingStatus.Failed,
        completedAt: new Date(),
      })

      throw error
    }

    await this.processingJobRepository.update(ctx.jobId, {
      status: ProcessingStatus.Completed,
      completedAt: new Date(),
    })

    this.eventEmitter.emit(
      MediaProcessingCompletedEvent.event,
      new MediaProcessingCompletedEvent({
        sourceAssetId: sourceAsset.id,
        entityType: sourceAsset.entityType,
        entityId: sourceAsset.entityId,
      }),
    )
  }
}
