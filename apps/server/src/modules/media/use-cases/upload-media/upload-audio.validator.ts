import { BadRequestException, Inject, Injectable } from '@nestjs/common'

import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { MediaModuleOptions } from '../../types'
import { UploadMediaUseCaseParams } from './upload-media.use-case'
import { FileService } from '../../services'

import { Validator } from '@/modules/shared/interfaces'

@Injectable()
export class UploadAudioValidator implements Validator<UploadMediaUseCaseParams> {
  private readonly allowedAudioMimeTypes: string[]
  private readonly maxAudioSize: number

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly fileService: FileService,
  ) {
    this.allowedAudioMimeTypes = options.allowedAudioMimeTypes
    this.maxAudioSize = options.maxAudioSize
  }

  validate(params: Partial<UploadMediaUseCaseParams>): void {
    if (!params.file) {
      throw new BadRequestException('File buffer is required')
    }

    const mimetype = params.file.mimetype

    if (!mimetype || !this.allowedAudioMimeTypes.includes(mimetype)) {
      throw new BadRequestException('Invalid audio mime type')
    }

    if (!params.file.size) {
      throw new BadRequestException('Audio size is required')
    }

    if (params.file.size > this.maxAudioSize) {
      throw new BadRequestException('Audio size is too large')
    }
  }
}
