import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common'
import { File } from '@nest-lab/fastify-multer'

import { UploadMediaValidator } from './upload-media.validator'
import {
  MediaSourceRepository,
  ProcessingJobRepository,
  ProcessingPipelineRepository,
  UploadTokenRepository,
} from '../../repositories'
import { MediaModuleOptions } from '../../types'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { StorageStrategy } from '../../strategies/storage'
import { MediaType, ProcessingJob, ProcessingStatus } from '../../enums'

import { DatabaseService } from '@/modules/database'

export interface UploadMediaUseCaseParams {
  readonly file: File
  readonly userId: string
  readonly token: string
}

@Injectable()
export class UploadMediaUseCase {
  private readonly storageStrategy: StorageStrategy

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly uploadMediaValidator: UploadMediaValidator,
    private readonly uploadTokenRepository: UploadTokenRepository,
    private readonly mediaSourceRepository: MediaSourceRepository,
    private readonly processingPipelineRepository: ProcessingPipelineRepository,
    private readonly processingJobRepository: ProcessingJobRepository,
    private readonly databaseService: DatabaseService,
  ) {
    this.storageStrategy = this.options.storageStrategy
  }

  async invoke(params: UploadMediaUseCaseParams): Promise<void> {
    const validationResult = await this.uploadMediaValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const uploadToken = await this.uploadTokenRepository.findOne(params.token)

    if (!uploadToken) {
      throw new ForbiddenException()
    }

    if (!params.file.buffer) {
      throw new BadRequestException()
    }

    const fileName = this.options.namingStrategy.generateFileName(params.file.originalname, uploadToken.entityId)

    const storagePath = await this.storageStrategy.uploadFromBuffer(fileName, params.file.buffer)

    try {
      await this.databaseService.sql.begin(async (transaction) => {
        const mediaSource = await this.mediaSourceRepository.create(
          {
            mediaType: uploadToken.mediaType,
            entityId: uploadToken.entityId,
            entityType: uploadToken.entityType,
            format: params.file.mimetype,
            fileSize: params.file.size ?? 0,
            storageProvider: this.storageStrategy.storageProvider,
            storagePath,
          },
          transaction,
        )

        const processingPipeline = await this.processingPipelineRepository.create(
          {
            sourceId: mediaSource.id,
            status: ProcessingStatus.PENDING,
          },
          transaction,
        )

        switch (uploadToken.mediaType) {
          case MediaType.ARTWORK:
            await Promise.all([
              this.processingJobRepository.create(
                {
                  pipelineId: processingPipeline.id,
                  jobName: ProcessingJob.IMAGE_TRANSFORM,
                  jobOrder: 1,
                  status: ProcessingStatus.PENDING,
                },
                transaction,
              ),
              this.processingJobRepository.create(
                {
                  pipelineId: processingPipeline.id,
                  jobName: ProcessingJob.IMAGE_ANALYZE,
                  jobOrder: 2,
                  status: ProcessingStatus.PENDING,
                },
                transaction,
              ),
            ])
            break
          case MediaType.AUDIO:
            await this.processingJobRepository.create(
              {
                pipelineId: processingPipeline.id,
                jobName: ProcessingJob.AUDIO_TRANSFORM,
                jobOrder: 1,
                status: ProcessingStatus.PENDING,
              },
              transaction,
            )
            break
        }

        await this.uploadTokenRepository.delete(params.token, transaction)
      })
    } catch (error) {
      await this.storageStrategy.delete(storagePath)
      throw error
    }
  }
}
