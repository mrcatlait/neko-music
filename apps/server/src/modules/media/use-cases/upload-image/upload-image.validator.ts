import { Inject, Injectable } from '@nestjs/common'
import sharp from 'sharp'

import { UploadImageUseCaseParams } from './upload-image.use-case'
import { MediaModuleOptions } from '../../types'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { FileUtilsService } from '../../services'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class UploadImageValidator implements Validator<UploadImageUseCaseParams> {
  private readonly allowedImageMimeTypes: string[]
  private readonly maxImageSize: number

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly fileUtilsService: FileUtilsService,
  ) {
    this.allowedImageMimeTypes = options.allowedImageMimeTypes
    this.maxImageSize = options.maxImageSize
  }

  async validate(params: Partial<UploadImageUseCaseParams>): Promise<ValidationResult> {
    if (!params.file) {
      return {
        isValid: false,
        errors: ['File buffer is required'],
      }
    }

    const mimetype = await this.fileUtilsService.getFileTypeFromBuffer(params.file)

    if (!mimetype || !this.allowedImageMimeTypes.includes(mimetype)) {
      return {
        isValid: false,
        errors: ['Invalid image mime type'],
      }
    }

    if (!params.file.length) {
      return {
        isValid: false,
        errors: ['Image size is required'],
      }
    }

    if (params.file.length > this.maxImageSize) {
      return {
        isValid: false,
        errors: ['Image size is too large'],
      }
    }

    try {
      const image = await sharp(params.file).metadata()

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
