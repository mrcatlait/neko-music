import { Inject, Injectable } from '@nestjs/common'

import { MEDIA_MODULE_OPTIONS } from '../tokens'
import { MediaModuleOptions } from '../types'
import { MediaAssetRepository, ProcessingPipelineRepository } from '../repositories'
import { ProcessingStatus } from '../enums'
import { ProcessingPipelineEntity } from '../entities'
import { StorageStrategy } from '../strategies/storage'
import { ImageTransformStrategy } from '../strategies/image-transform'
import { NamingStrategy } from '../strategies/naming'

const MAX_ATTEMPTS = 3

@Injectable()
export class AssetProcessingService {
  private readonly storageStrategy: StorageStrategy
  private readonly imageTransformStrategy: ImageTransformStrategy
  private readonly namingStrategy: NamingStrategy

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly processingPipelineRepository: ProcessingPipelineRepository,
    private readonly mediaAssetRepository: MediaAssetRepository,
  ) {
    this.storageStrategy = this.options.storageStrategy
    this.imageTransformStrategy = this.options.imageTransformStrategy
    this.namingStrategy = this.options.namingStrategy
  }

  /**
   * Start processing a pending job.
   * If no pending job is found, retry processing a failed job.
   */
  async startProcessing(): Promise<void> {
    const pendingJob = await this.processingPipelineRepository.findOneByStatus(ProcessingStatus.PENDING)

    if (!pendingJob) {
      return this.retryProcessing()
    }

    return this.process(pendingJob)
  }

  /**
   * Retry processing a failed job.
   * If no failed job is found or the max attempts is reached, do nothing.
   */
  async retryProcessing(): Promise<void> {
    const failedJob = await this.processingPipelineRepository.findOneFailedByAttempts(MAX_ATTEMPTS)

    if (!failedJob) {
      return
    }

    return this.process(failedJob)
  }

  async process(job: ProcessingPipelineEntity): Promise<void> {
    try {
      await this.processingPipelineRepository.update({
        ...job,
        status: ProcessingStatus.PENDING,
        startedAt: new Date(),
      })

      const mediaAsset = await this.mediaAssetRepository.findOne(job.assetId)

      if (!mediaAsset) {
        throw new Error('Media asset not found')
      }

      // const source = await this.sourceRepository.findOne(mediaAsset.sourceId)

      const fileBuffer = await this.storageStrategy.downloadToBuffer(mediaAsset.storagePath)

      const format = 'webp'

      const image = await this.imageTransformStrategy.transform(fileBuffer, {
        width: 56,
        height: 56,
        format,
      })

      const fileName = this.namingStrategy.generateFileName(`small.${format}`, mediaAsset.entityId)

      await this.storageStrategy.uploadFromBuffer(fileName, image)

      await this.mediaAssetRepository.update({
        ...mediaAsset,
        storagePath: fileName,
        publicUrl: fileName,
        format,
      })

      await this.processingPipelineRepository.update({
        ...job,
        status: ProcessingStatus.COMPLETED,
        attempts: job.attempts + 1,
        completedAt: new Date(),
      })
    } catch (error) {
      await this.processingPipelineRepository.update({
        ...job,
        status: ProcessingStatus.FAILED,
        attempts: job.attempts + 1,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
      })
    }
  }
}
