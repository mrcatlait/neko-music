import { Inject, Injectable } from '@nestjs/common'

import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { MediaModuleOptions } from '../../types'
import { UploadMediaUseCaseParams } from './upload-media.use-case'
import { FileService } from '../../services'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

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

  async validate(params: Partial<UploadMediaUseCaseParams>): Promise<ValidationResult> {
    if (!params.file) {
      return {
        isValid: false,
        errors: ['File buffer is required'],
      }
    }

    const mimetype = params.file.mimetype

    if (!mimetype || !this.allowedAudioMimeTypes.includes(mimetype)) {
      return {
        isValid: false,
        errors: ['Invalid audio mime type'],
      }
    }

    if (!params.file.size) {
      return {
        isValid: false,
        errors: ['Audio size is required'],
      }
    }

    if (params.file.size > this.maxAudioSize) {
      return {
        isValid: false,
        errors: ['Audio size is too large'],
      }
    }

    return {
      isValid: true,
    }
  }
}
