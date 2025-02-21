import { Injectable } from '@nestjs/common'

import { UploadMediaCommand } from './upload-media.command'

import { UploadTokenRepository } from '@modules/media/repositories'
import { ValidationResult, Validator } from '@modules/shared/models'

@Injectable()
export class UploadMediaValidator implements Validator<UploadMediaCommand> {
  constructor(private readonly uploadTokenRepository: UploadTokenRepository) {}

  async validate(command: UploadMediaCommand): Promise<ValidationResult> {
    const uploadToken = await this.uploadTokenRepository.getById(command.token)

    if (!uploadToken) {
      return {
        isValid: false,
        errors: ['Upload token not found'],
      }
    }

    if (uploadToken.expires_at < new Date()) {
      return {
        isValid: false,
        errors: ['Upload token expired'],
      }
    }

    if (uploadToken.user_id !== command.userId) {
      return {
        isValid: false,
        errors: ['Upload token does not belong to the user'],
      }
    }

    if (!command.file.buffer) {
      return {
        isValid: false,
        errors: ['File buffer is required'],
      }
    }

    return {
      isValid: true,
    }
  }
}
