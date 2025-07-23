import { BadRequestException, ForbiddenException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { UploadMediaCommand } from './upload-media.command'
import { UploadMediaValidator } from './upload-media.validator'
import { UploadTokenRepository } from '../../repositories'
import { UploadStrategyName, UploadStrategyRegistry } from '../../strategies/upload'

import { EntityType } from '@modules/media/enums'

@CommandHandler(UploadMediaCommand)
export class UploadMediaHandler implements ICommandHandler<UploadMediaCommand> {
  constructor(
    private readonly uploadMediaValidator: UploadMediaValidator,
    private readonly uploadTokenRepository: UploadTokenRepository,
    private readonly uploadStrategyRegistry: UploadStrategyRegistry,
  ) {}

  async execute(command: UploadMediaCommand): Promise<void> {
    const validationResult = await this.uploadMediaValidator.validate(command)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const uploadToken = await this.uploadTokenRepository.findOne(command.token)

    if (!uploadToken) {
      throw new ForbiddenException()
    }

    let strategyName: UploadStrategyName

    switch (uploadToken.entityType) {
      case EntityType.ARTIST:
        strategyName = 'artist-artwork'
        break
      default:
        throw new BadRequestException('Invalid entity type')
    }

    const uploadStrategy = this.uploadStrategyRegistry.getStrategy(strategyName)

    return uploadStrategy.upload({
      entityId: uploadToken.entityId,
      file: command.file,
    })
  }
}
