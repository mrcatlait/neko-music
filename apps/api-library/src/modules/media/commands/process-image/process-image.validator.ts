import { Injectable } from '@nestjs/common'

import { ValidationResult, Validator } from '@modules/shared/models'
import { MediaType, ProcessingStatus } from '@modules/media/shared/enums'
import { ProcessingMediaRepository } from '@modules/media/shared/repositories'

import { ProcessImageCommand } from './process-image.command'

@Injectable()
export class ProcessImageValidator implements Validator<ProcessImageCommand> {
  constructor(private readonly processingMediaRepository: ProcessingMediaRepository) {}

  async validate(command: ProcessImageCommand): Promise<ValidationResult> {
    const processingMedia = await this.processingMediaRepository.getById(command.processingMediaId)

    if (!processingMedia) {
      return { isValid: false, errors: ['processingMediaNotFound'] }
    }

    if (processingMedia.status !== ProcessingStatus.PENDING) {
      return { isValid: false, errors: ['processingMediaNotPending'] }
    }

    if (processingMedia.media_type !== MediaType.IMAGE) {
      return { isValid: false, errors: ['processingMediaNotImage'] }
    }

    return { isValid: true }
  }
}
