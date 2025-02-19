import { Injectable } from '@nestjs/common'

import { Handler } from '@modules/shared/models'
import { UploadTokenRepository } from '@modules/media/shared/repositories'

import { CreateUploadTokenCommand } from './create-upload-token.command'

@Injectable()
export class CreateUploadTokenHandler implements Handler<CreateUploadTokenCommand, string> {
  private readonly TOKEN_EXPIRATION_TIME = 1000 * 60 * 10 // 10 minutes

  constructor(private readonly uploadTokenRepository: UploadTokenRepository) {}

  async handle(command: CreateUploadTokenCommand): Promise<string> {
    const token = await this.uploadTokenRepository.findByUserIdAndEntityId(command.userId, command.entityId)

    if (token) {
      await this.uploadTokenRepository.delete(token.id)
    }

    const newToken = await this.uploadTokenRepository.create({
      user_id: command.userId,
      entity_id: command.entityId,
      entity_type: command.entityType,
      media_type: command.mediaType,
      expires_at: new Date(Date.now() + this.TOKEN_EXPIRATION_TIME),
    })

    return newToken.id
  }
}
