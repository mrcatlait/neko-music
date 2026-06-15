import { Injectable } from '@nestjs/common'

import { ProcessingJobItemRepository } from '../repositories/processing-job-item.repository'
import { ProcessingJobItem, ProcessingStatus } from '../enums'
import { ImageService } from './image.service'
import { AudioService } from './audio.service'

interface JobItemContext {
  jobItemId: string
  name: ProcessingJobItem
  sourceAssetId: string
}

@Injectable()
export class ProcessingJobItemRunnerService {
  constructor(
    private readonly processingJobItemRepository: ProcessingJobItemRepository,
    private readonly imageService: ImageService,
    private readonly audioService: AudioService,
  ) {}

  async run(ctx: JobItemContext): Promise<void> {
    await this.processingJobItemRepository.update(ctx.jobItemId, {
      status: ProcessingStatus.Processing,
      startedAt: new Date(),
    })

    try {
      switch (ctx.name) {
        case ProcessingJobItem.ImageTransformation: {
          await this.imageService.transform(ctx.sourceAssetId)
          break
        }
        case ProcessingJobItem.AudioTransformation:
          await this.audioService.transform(ctx.sourceAssetId)
          break
      }
    } catch (error) {
      console.error(error)

      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const shortErrorMessage = errorMessage.length > 255 ? errorMessage.slice(0, 255) : errorMessage

      await this.processingJobItemRepository.update(ctx.jobItemId, {
        status: ProcessingStatus.Failed,
        completedAt: new Date(),
        errorMessage: shortErrorMessage,
      })

      throw error
    }

    await this.processingJobItemRepository.update(ctx.jobItemId, {
      status: ProcessingStatus.Completed,
      completedAt: new Date(),
    })
  }
}
