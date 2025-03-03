import { Injectable } from '@nestjs/common'
import sharp from 'sharp'

import { UploadMediaCommand } from './upload-media.command'

import { ValidationResult, Validator } from '@modules/shared/models'
import { UploadTokenRepository } from '@modules/media/repositories'
import { MediaType } from '@modules/media/enums'

const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const ALLOWED_VIDEO_MIME_TYPES = ['video/mp4', 'video/webm']
const ALLOWED_AUDIO_MIME_TYPES = ['audio/mpeg', 'audio/wav']

@Injectable()
export class UploadMediaValidator implements Validator<UploadMediaCommand> {
  constructor(private readonly uploadTokenRepository: UploadTokenRepository) {}

  async validate(command: UploadMediaCommand): Promise<ValidationResult> {
    const uploadToken = await this.uploadTokenRepository.findOne(command.token)

    if (!uploadToken) {
      return {
        isValid: false,
        errors: ['Upload token not found'],
      }
    }

    if (!command.file.buffer) {
      return {
        isValid: false,
        errors: ['File buffer is required'],
      }
    }

    if (uploadToken.media_type === MediaType.IMAGE) {
      if (!ALLOWED_IMAGE_MIME_TYPES.includes(command.file.mimetype)) {
        return {
          isValid: false,
          errors: ['Invalid image mime type'],
        }
      }

      try {
        const image = await sharp(command.file.buffer).metadata()

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
    }

    return {
      isValid: true,
    }
  }
}
