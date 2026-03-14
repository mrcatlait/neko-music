import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { File } from '@nest-lab/fastify-multer'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { join } from 'node:path'

import { UploadImageValidator } from './upload-image.validator'
import { UploadAudioValidator } from './upload-audio.validator'
import { MediaType, ProcessingStatus, ProcessingStep } from '../../enums'
import { MediaRepository, SourceAssetRepository, UploadTokenRepository } from '../../repositories'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { MediaModuleOptions } from '../../types'
import { NamingStrategy, StorageStrategy } from '../../strategies'
import { FileService } from '../../services'
import { MediaUploadedEvent } from '../../events'

import { UseCase, Validator } from '@/modules/shared/interfaces'

export interface UploadMediaUseCaseParams {
  readonly file: File
  readonly token: string
}

export interface UploadMediaUseCaseResult {
  readonly processingJobId: string
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
    const uploadToken = await this.uploadTokenRepository.findById(params.token)

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

    /**
     * @todo need to validate if there is already a media with the same entity type and entity id
     * @todo need to validate if there is already media in processing
     * @todo need to check for duplicates
     */
    const validationResult = await validator.validate(params)

    if (!validationResult.isValid) {
      throw new Error(validationResult.error)
    }

    const format = await this.fileService.getFileTypeFromBuffer(params.file.buffer!)
    const fileName = this.namingStrategy.generateRandomFileName(format)
    const storagePath = await this.storageStrategy.uploadFromBuffer(
      join(this.sourceFolder, fileName),
      params.file.buffer!,
    )

    let processingSteps: ProcessingStep[] = []

    // @todo Think of a better way to determine the processing steps based on the media type and entity type
    // Maybe create empty pipeline and add the steps to it later in separate use cases
    switch (uploadToken.mediaType) {
      case MediaType.Image:
        processingSteps = [ProcessingStep.ImageTransformation]
        break
      case MediaType.Audio:
        processingSteps = [ProcessingStep.AudioTransformation]
        break
    }

    try {
      const sourceAsset = await this.sourceAssetRepository.create({
        mediaType: uploadToken.mediaType,
        entityType: uploadToken.entityType,
        entityId: uploadToken.entityId,
        fileSize: params.file.size ?? 0,
        storageProvider: this.storageStrategy.name,
        checksum: this.fileService.computeChecksumFromBuffer(params.file.buffer!),
        createdBy: uploadToken.userId,
        format,
        storagePath,
      })

      const processingJobId = await this.mediaRepository.createProcessingJob({
        sourceAssetId: sourceAsset.id,
        status: ProcessingStatus.Pending,
      })

      await this.mediaRepository.createProcessingSteps(
        processingSteps.map((step) => ({
          status: ProcessingStatus.Pending,
          jobId: processingJobId,
          name: step,
          order: processingSteps.indexOf(step) + 1,
        })),
      )

      await this.uploadTokenRepository.deleteById(uploadToken.id)

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
}
