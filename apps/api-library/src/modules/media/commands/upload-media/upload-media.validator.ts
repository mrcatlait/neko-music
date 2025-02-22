import { Injectable } from '@nestjs/common'

import { UploadMediaCommand } from './upload-media.command'

import { ValidationResult, Validator } from '@modules/shared/models'

@Injectable()
export class UploadMediaValidator implements Validator<UploadMediaCommand> {
  validate(command: UploadMediaCommand): ValidationResult {
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
