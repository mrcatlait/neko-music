import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { GenerateUploadTokenCommand } from './generate-upload-token.command'

import { UploadTokenRepository } from '@modules/media/repositories'
import { EntityType } from '@modules/media/enums'

@CommandHandler(GenerateUploadTokenCommand)
export class GenerateUploadTokenHandler implements ICommandHandler<GenerateUploadTokenCommand> {
  private readonly TOKEN_EXPIRATION_TIME = 1000 * 60 * 10 // 10 minutes

  constructor(private readonly uploadTokenRepository: UploadTokenRepository) {}

  async execute(command: GenerateUploadTokenCommand): Promise<{ uploadToken: string }> {
    const token = await this.uploadTokenRepository.findOneByUserIdAndType(command.userId, command.mediaType)

    if (token) {
      await this.uploadTokenRepository.delete(token.id)
    }

    const newToken = await this.uploadTokenRepository.create({
      user_id: command.userId,
      media_type: command.mediaType,
      expires_at: new Date(Date.now() + this.TOKEN_EXPIRATION_TIME),
      entity_type: EntityType.ALBUM,
      entity_id: '',
    })

    return { uploadToken: newToken.id }
  }
}
