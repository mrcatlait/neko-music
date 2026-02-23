import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { File } from '@nest-lab/fastify-multer'

import { UploadImageValidator } from './upload-image.validator'
import { UploadAudioValidator } from './upload-audio.validator'
import { MediaType, ProcessingStep } from '../../enums'
import { MediaRepository } from '../../repositories'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { MediaModuleOptions } from '../../types'
import { NamingStrategy, StorageStrategy } from '../../strategies'
import { FileService } from '../../services'

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

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly mediaRepository: MediaRepository,
    private readonly fileService: FileService,
    private readonly uploadImageValidator: UploadImageValidator,
    private readonly uploadAudioValidator: UploadAudioValidator,
  ) {
    this.storageStrategy = options.storageStrategy
    this.namingStrategy = options.namingStrategy
  }

  async invoke(params: UploadMediaUseCaseParams): Promise<UploadMediaUseCaseResult> {
    const uploadToken = await this.mediaRepository.findUploadTokenById(params.token)

    if (!uploadToken) {
      throw new ForbiddenException()
    }

    let validator: Validator<UploadMediaUseCaseParams>

    switch (uploadToken.mediaType) {
      case MediaType.IMAGE:
        validator = this.uploadImageValidator
        break
      case MediaType.AUDIO:
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
      throw new BadRequestException(validationResult.errors)
    }

    const format = await this.fileService.getFileTypeFromBuffer(params.file.buffer!)
    const fileName = this.namingStrategy.generateRandomFileName(format)
    const storagePath = await this.storageStrategy.uploadFromBuffer(fileName, params.file.buffer!)

    let processingSteps: ProcessingStep[] = []

    // @todo Think of a better way to determine the processing steps based on the media type and entity type
    // Maybe create empty pipeline and add the steps to it later in separate use cases
    switch (uploadToken.mediaType) {
      case MediaType.IMAGE:
        processingSteps = [ProcessingStep.IMAGE_TRANSFORMATION]
        break
      case MediaType.AUDIO:
        processingSteps = [ProcessingStep.AUDIO_TRANSFORMATION]
        break
    }

    try {
      const processingJobId = await this.mediaRepository.createSourceAssetAndProcessingJob(
        {
          mediaType: uploadToken.mediaType,
          entityType: uploadToken.entityType,
          entityId: uploadToken.entityId,
          fileSize: params.file.size ?? 0,
          storageProvider: this.storageStrategy.name,
          checksum: this.fileService.computeChecksumFromBuffer(params.file.buffer!),
          createdBy: uploadToken.userId,
          format,
          storagePath,
        },
        processingSteps,
      )

      // @todo remove upload token

      return { processingJobId }
    } catch (error) {
      await this.storageStrategy.delete(storagePath)
      throw error
    }
  }
}
