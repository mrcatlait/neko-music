import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common'
import { File } from '@nest-lab/fastify-multer'

import { UploadMediaValidator } from './upload-media.validator'
import { UploadTokenRepository } from '../../repositories'
import { UploadStrategyName, UploadStrategyRegistry } from '../../strategies/upload'
import { EntityType } from '../../enums'

export interface UploadMediaUseCaseParams {
  readonly file: File
  readonly userId: string
  readonly token: string
}

@Injectable()
export class UploadMediaUseCase {
  constructor(
    private readonly uploadMediaValidator: UploadMediaValidator,
    private readonly uploadTokenRepository: UploadTokenRepository,
    private readonly uploadStrategyRegistry: UploadStrategyRegistry,
  ) {}

  async invoke(params: UploadMediaUseCaseParams): Promise<void> {
    const validationResult = await this.uploadMediaValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const uploadToken = await this.uploadTokenRepository.findOne(params.token)

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
      file: params.file,
    })
  }
}
