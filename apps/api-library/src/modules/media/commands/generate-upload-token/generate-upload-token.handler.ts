import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { GenerateUploadTokenCommand } from './generate-upload-token.command'

import { UploadTokenRepository } from '@modules/media/repositories'

@CommandHandler(GenerateUploadTokenCommand)
export class GenerateUploadTokenHandler implements ICommandHandler<GenerateUploadTokenCommand> {
  private readonly TOKEN_EXPIRATION_TIME = 1000 * 60 * 10 // 10 minutes

  constructor(private readonly uploadTokenRepository: UploadTokenRepository) {}

  async execute(command: GenerateUploadTokenCommand): Promise<{ token: string }> {
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

    return { token: newToken.id }
  }
}
