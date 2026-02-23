import { Inject, Injectable } from '@nestjs/common'
import sharp from 'sharp'

import { MediaModuleOptions } from '../../types'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { FileService } from '../../services'
import { UploadMediaUseCaseParams } from './upload-media.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class UploadImageValidator implements Validator<UploadMediaUseCaseParams> {
  private readonly allowedImageMimeTypes: string[]
  private readonly maxImageSize: number

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly fileService: FileService,
  ) {
    this.allowedImageMimeTypes = options.allowedImageMimeTypes
    this.maxImageSize = options.maxImageSize
  }

  async validate(params: Partial<UploadMediaUseCaseParams>): Promise<ValidationResult> {
    if (!params.file) {
      return {
        isValid: false,
        errors: ['File buffer is required'],
      }
    }

    const mimetype = params.file.mimetype

    if (!mimetype || !this.allowedImageMimeTypes.includes(mimetype)) {
      return {
        isValid: false,
        errors: ['Invalid image mime type'],
      }
    }

    if (!params.file.size) {
      return {
        isValid: false,
        errors: ['Image size is required'],
      }
    }

    if (params.file.size > this.maxImageSize) {
      return {
        isValid: false,
        errors: ['Image size is too large'],
      }
    }

    try {
      const image = await sharp(params.file.buffer).metadata()

      if (image.width === 0 || image.height === 0) {
        return {
          isValid: false,
          errors: ['Invalid image dimensions'],
        }
      }
    } catch {
      return {
        isValid: false,
        errors: ['Invalid image'],
      }
    }

    return {
      isValid: true,
    }
  }
}
