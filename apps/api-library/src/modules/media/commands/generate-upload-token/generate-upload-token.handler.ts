import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { UploadTokenRepository } from '../../repositories'
import { GenerateUploadTokenCommand } from './generate-upload-token.command'

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
      userId: command.userId,
      mediaType: command.mediaType,
      expiresAt: new Date(Date.now() + this.TOKEN_EXPIRATION_TIME),
      entityType: command.entityType,
      entityId: command.entityId,
    })

    return { uploadToken: newToken.id }
  }
}
