import { Injectable } from '@nestjs/common'
import sharp from 'sharp'

import { UploadTokenRepository } from '../../repositories'
import { MediaType } from '../../enums'
import { UploadMediaUseCaseParams } from './upload-media.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_VIDEO_MIME_TYPES = ['video/mp4', 'video/webm']
const ALLOWED_AUDIO_MIME_TYPES = ['audio/mpeg', 'audio/wav']

@Injectable()
export class UploadMediaValidator implements Validator<UploadMediaUseCaseParams> {
  constructor(private readonly uploadTokenRepository: UploadTokenRepository) {}

  async validate(params: UploadMediaUseCaseParams): Promise<ValidationResult> {
    const uploadToken = await this.uploadTokenRepository.findOne(params.token)

    if (!uploadToken) {
      return {
        isValid: false,
        errors: ['Upload token not found'],
      }
    }

    if (!params.file.buffer) {
      return {
        isValid: false,
        errors: ['File buffer is required'],
      }
    }

    switch (uploadToken.mediaType) {
      case MediaType.ARTWORK:
        return this.validateImage(params)
      // case MediaType.AUDIO:
      //   return this.validateAudio(command)
      default:
        return {
          isValid: false,
          errors: ['Invalid media type'],
        }
    }
  }

  private async validateImage(params: UploadMediaUseCaseParams): Promise<ValidationResult> {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(params.file.mimetype)) {
      return {
        isValid: false,
        errors: ['Invalid image mime type'],
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
