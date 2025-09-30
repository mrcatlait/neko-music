import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { File } from '@nest-lab/fastify-multer'

import { UploadImageValidator } from './upload-image.validator'
import { MediaModuleOptions } from '../../types'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { StorageStrategy } from '../../strategies/storage'
import { EntityType } from '../../enums'

import { DatabaseService } from '@/modules/database'
import { UseCase } from '@/modules/shared/interfaces'

export interface UploadImageUseCaseParams {
  readonly file: File
  readonly entityId: string
  readonly entityType: EntityType
}

@Injectable()
export class UploadImageUseCase implements UseCase<UploadImageUseCaseParams, void> {
  private readonly storageStrategy: StorageStrategy
  private readonly temporaryDirectory: string

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly uploadImageValidator: UploadImageValidator,
  ) {
    this.storageStrategy = this.options.storageStrategy
    this.temporaryDirectory = this.options.temporaryDirectory
  }

  async invoke(params: UploadImageUseCaseParams): Promise<void> {
    const validationResult = await this.uploadImageValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }
  }
}
