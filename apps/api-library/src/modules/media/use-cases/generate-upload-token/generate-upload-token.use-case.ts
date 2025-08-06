import { Injectable } from '@nestjs/common'

import { UploadTokenRepository } from '../../repositories'
import { EntityType, MediaType } from '../../enums'

interface GenerateUploadTokenUseCaseParams {
  readonly userId: string
  readonly mediaType: MediaType
  readonly entityType: EntityType
  readonly entityId: string
}

@Injectable()
export class GenerateUploadTokenUseCase {
  private readonly TOKEN_EXPIRATION_TIME = 1000 * 60 * 10 // 10 minutes

  constructor(private readonly uploadTokenRepository: UploadTokenRepository) {}

  async invoke(params: GenerateUploadTokenUseCaseParams): Promise<{ uploadToken: string }> {
    const token = await this.uploadTokenRepository.findOneByUserIdAndType(params.userId, params.mediaType)

    if (token) {
      await this.uploadTokenRepository.delete(token.id)
    }

    const newToken = await this.uploadTokenRepository.create({
      userId: params.userId,
      mediaType: params.mediaType,
      expiresAt: new Date(Date.now() + this.TOKEN_EXPIRATION_TIME),
      entityType: params.entityType,
      entityId: params.entityId,
    })

    return { uploadToken: newToken.id }
  }
}
