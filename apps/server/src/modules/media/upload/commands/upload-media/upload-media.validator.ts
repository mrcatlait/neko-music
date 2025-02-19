import { Injectable } from '@nestjs/common'

import { ValidationResult, Validator } from '@modules/shared/models'
import { UploadTokenRepository } from '@modules/media/shared/repositories'

import { UploadMediaCommand } from './upload-media.command'

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

    return {
      isValid: true,
    }
  }
}
