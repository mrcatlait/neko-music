import { Inject, Injectable } from '@nestjs/common'
import sharp from 'sharp'

import { UploadImageUseCaseParams } from './upload-image.use-case'
import { MediaModuleOptions } from '../../types'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class UploadImageValidator implements Validator<UploadImageUseCaseParams> {
  private readonly allowedImageMimeTypes: string[]
  private readonly maxImageSize: number

  constructor(@Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions) {
    this.allowedImageMimeTypes = options.allowedImageMimeTypes
    this.maxImageSize = options.maxImageSize
  }

  async validate(params: UploadImageUseCaseParams): Promise<ValidationResult> {
    if (!params.file.buffer) {
      return {
        isValid: false,
        errors: ['File buffer is required'],
      }
    }

    if (!this.allowedImageMimeTypes.includes(params.file.mimetype)) {
      return {
        isValid: false,
        errors: ['Invalid image mime type'],
      }
    }

    if (params.file.size === undefined) {
      return {
        isValid: false,
        errors: ['Image size is undefined'],
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
