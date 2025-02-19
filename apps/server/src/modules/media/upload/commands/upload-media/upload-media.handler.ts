import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import { UploadTokenRepository } from '@modules/media/shared/repositories'
import { Handler } from '@modules/shared/models'

import { UploadMediaCommand } from './upload-media.command'
import { UploadMediaValidator } from './upload-media.validator'

@Injectable()
export class UploadMediaHandler implements Handler<UploadMediaCommand, void> {
  constructor(
    private readonly uploadTokenRepository: UploadTokenRepository,
    private readonly uploadMediaValidator: UploadMediaValidator,
  ) {}

  async handle(command: UploadMediaCommand): Promise<void> {
    const validationResult = await this.uploadMediaValidator.validate(command)

    if (!validationResult.isValid) {
      throw new ForbiddenException(validationResult.errors)
    }

    const uploadToken = await this.uploadTokenRepository.findById(token)

    if (!uploadToken) {
      throw new NotFoundException('Upload token not found')
    }
  }
}
