import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { File } from '@nest-lab/fastify-multer'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { join } from 'node:path'

import { UploadImageValidator } from './upload-image.validator'
import { UploadAudioValidator } from './upload-audio.validator'
import { EntityType, MediaType, ProcessingStatus, ProcessingStep } from '../../enums'
import { MediaRepository, SourceAssetRepository, UploadTokenRepository } from '../../repositories'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { MediaModuleOptions } from '../../types'
import { NamingStrategy, StorageStrategy } from '../../strategies'
import { FileService } from '../../services'
import { MediaUploadedEvent } from '../../events'

import { UseCase, Validator } from '@/modules/shared/types'

export interface UploadMediaUseCaseParams {
  readonly file: File
  readonly token: string
}

export interface UploadMediaUseCaseResult {
  readonly processingJobId: string
}

interface UploadMediaToken {
  readonly mediaType: MediaType
  readonly entityType: EntityType
  readonly entityId: string
}

@Injectable()
export class UploadMediaUseCase implements UseCase<UploadMediaUseCaseParams, UploadMediaUseCaseResult> {
  private readonly storageStrategy: StorageStrategy
  private readonly namingStrategy: NamingStrategy
  private readonly sourceFolder = 'source'

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly eventEmitter: EventEmitter2,
    private readonly mediaRepository: MediaRepository,
    private readonly uploadTokenRepository: UploadTokenRepository,
    private readonly fileService: FileService,
    private readonly sourceAssetRepository: SourceAssetRepository,
    private readonly uploadImageValidator: UploadImageValidator,
    private readonly uploadAudioValidator: UploadAudioValidator,
  ) {
    this.storageStrategy = options.storageStrategy
    this.namingStrategy = options.namingStrategy
  }

  async invoke(params: UploadMediaUseCaseParams): Promise<UploadMediaUseCaseResult> {
    const uploadToken = await this.uploadTokenRepository.findOne(params.token)

    if (!uploadToken) {
      throw new ForbiddenException()
    }

    let validator: Validator<UploadMediaUseCaseParams>

    switch (uploadToken.mediaType) {
      case MediaType.Image:
        validator = this.uploadImageValidator
        break
      case MediaType.Audio:
        validator = this.uploadAudioValidator
        break
      default:
        throw new BadRequestException('Invalid media type')
    }

    await validator.validate(params)
    const checksum = this.fileService.computeChecksumFromBuffer(params.file.buffer!)

    await this.validateNoProcessingInProgress(uploadToken)
    await this.validateNoDuplicate(uploadToken, checksum)

    const format = await this.fileService.getFileTypeFromBuffer(params.file.buffer!)
    const fileName = this.namingStrategy.generateRandomFileName(format)
    const storagePath = await this.storageStrategy.uploadFromBuffer(
      join(this.sourceFolder, fileName),
      params.file.buffer!,
    )

    const processingSteps = this.resolveProcessingSteps(uploadToken.mediaType)

    try {
      const processingJobId = await this.mediaRepository.createSourceAssetAndProcessingJob(
        {
          mediaType: uploadToken.mediaType,
          entityType: uploadToken.entityType,
          entityId: uploadToken.entityId,
          fileSize: params.file.size ?? 0,
          storageProvider: this.storageStrategy.name,
          checksum,
          createdBy: uploadToken.userId,
          format,
          storagePath,
        },
        processingSteps,
      )

      await this.uploadTokenRepository.delete(uploadToken.id)

      this.eventEmitter.emit(
        MediaUploadedEvent.event,
        new MediaUploadedEvent({
          entityType: uploadToken.entityType,
          entityId: uploadToken.entityId,
        }),
      )

      return { processingJobId }
    } catch (error) {
      await this.storageStrategy.delete(storagePath)
      throw error
    }
  }

  private async validateNoDuplicate(uploadToken: UploadMediaToken, checksum: string): Promise<void> {
    const duplicateExists = await this.sourceAssetRepository.exists({
      entityType: uploadToken.entityType,
      entityId: uploadToken.entityId,
      mediaType: uploadToken.mediaType,
      checksum,
    })

    if (duplicateExists) {
      throw new BadRequestException('Duplicate media upload')
    }
  }

  private async validateNoProcessingInProgress(uploadToken: UploadMediaToken): Promise<void> {
    const sourceAssets = await this.sourceAssetRepository.findMany({
      entityType: uploadToken.entityType,
      entityId: uploadToken.entityId,
      mediaType: uploadToken.mediaType,
    })

    if (sourceAssets.length === 0) {
      return
    }

    const latestSourceAsset = sourceAssets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
    const latestProcessingJob = await this.mediaRepository.findProcessingJobBySourceAssetId(latestSourceAsset.id)

    if (
      latestProcessingJob &&
      (latestProcessingJob.status === ProcessingStatus.Pending ||
        latestProcessingJob.status === ProcessingStatus.Processing)
    ) {
      throw new BadRequestException('Media is already being processed')
    }
  }

  private resolveProcessingSteps(mediaType: MediaType): ProcessingStep[] {
    // @todo Think of a better way to determine the processing steps based on the media type and entity type
    // Maybe create empty pipeline and add the steps to it later in separate use cases
    switch (mediaType) {
      case MediaType.Image:
        return [ProcessingStep.ImageTransformation]
      case MediaType.Audio:
        return [ProcessingStep.AudioTransformation]
      default:
        return []
    }
  }
}
