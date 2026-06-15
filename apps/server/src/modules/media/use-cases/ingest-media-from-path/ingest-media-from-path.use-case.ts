import { Inject, Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

import { EntityType, MediaType, ProcessingJobItem } from '../../enums'
import { MediaRepository } from '../../repositories'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { MediaModuleOptions } from '../../types'
import { NamingStrategy, StorageStrategy } from '../../strategies'
import { FileService } from '../../services'
import { MediaUploadedEvent } from '../../events'

import { UseCase } from '@/modules/shared/types'

export interface IngestMediaFromPathUseCaseParams {
  readonly filePath: string
  readonly mediaType: MediaType
  readonly entityType: EntityType
  readonly entityId: string
  readonly userId: string
}

export interface IngestMediaFromPathUseCaseResult {
  readonly processingJobId: string
}

@Injectable()
export class IngestMediaFromPathUseCase implements UseCase<IngestMediaFromPathUseCaseParams, IngestMediaFromPathUseCaseResult> {
  private readonly storageStrategy: StorageStrategy
  private readonly namingStrategy: NamingStrategy
  private readonly sourceFolder = 'source'

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly eventEmitter: EventEmitter2,
    private readonly mediaRepository: MediaRepository,
    private readonly fileService: FileService,
  ) {
    this.storageStrategy = options.storageStrategy
    this.namingStrategy = options.namingStrategy
  }

  async invoke(params: IngestMediaFromPathUseCaseParams): Promise<IngestMediaFromPathUseCaseResult> {
    if (!existsSync(params.filePath)) {
      throw new Error(`File not found: ${params.filePath}`)
    }

    const buffer = readFileSync(params.filePath)
    const checksum = this.fileService.computeChecksumFromBuffer(buffer)
    const format = await this.fileService.getFileTypeFromBuffer(buffer)
    const fileName = this.namingStrategy.generateRandomFileName(format)
    const storagePath = await this.storageStrategy.uploadFromBuffer(join(this.sourceFolder, fileName), buffer)

    const processingSteps = this.resolveProcessingSteps(params.mediaType)

    try {
      const processingJobId = await this.mediaRepository.createSourceAssetAndProcessingJob(
        {
          mediaType: params.mediaType,
          entityType: params.entityType,
          entityId: params.entityId,
          fileSize: buffer.length,
          storageProvider: this.storageStrategy.name,
          checksum,
          createdBy: params.userId,
          format,
          storagePath,
        },
        processingSteps,
      )

      this.eventEmitter.emit(
        MediaUploadedEvent.event,
        new MediaUploadedEvent({
          entityType: params.entityType,
          entityId: params.entityId,
        }),
      )

      return { processingJobId }
    } catch (error) {
      await this.storageStrategy.delete(storagePath)
      throw error
    }
  }

  private resolveProcessingSteps(mediaType: MediaType): ProcessingJobItem[] {
    switch (mediaType) {
      case MediaType.Image:
        return [ProcessingJobItem.ImageTransformation]
      case MediaType.Audio:
        return [ProcessingJobItem.AudioTransformation]
      default:
        return []
    }
  }
}
