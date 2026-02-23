import { Inject, Injectable } from '@nestjs/common'

import { EntityType, MediaType } from '../../enums'
import { MediaRepository } from '../../repositories'
import { MEDIA_MODULE_OPTIONS } from '../../tokens'
import { MediaModuleOptions } from '../../types'

import { UseCase } from '@/modules/shared/interfaces'
import { parseTimePeriod } from '@/modules/shared/utils'

interface GenerateUploadTokenUseCaseParams {
  readonly userId: string
  readonly mediaType: MediaType
  readonly entityType: EntityType
  readonly entityId: string
}

export interface GenerateUploadTokenUseCaseResult {
  readonly uploadToken: string
}

@Injectable()
export class GenerateUploadTokenUseCase implements UseCase<
  GenerateUploadTokenUseCaseParams,
  GenerateUploadTokenUseCaseResult
> {
  private readonly uploadTokenExpiresIn: number

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly mediaRepository: MediaRepository,
  ) {
    this.uploadTokenExpiresIn = parseTimePeriod(options.uploadTokenExpiresIn) * 1000
  }

  async invoke(params: GenerateUploadTokenUseCaseParams): Promise<{ uploadToken: string }> {
    const token = await this.mediaRepository.findUploadTokenById(params.userId)

    if (token) {
      await this.mediaRepository.deleteUploadTokenById(token.id)
    }

    const newToken = await this.mediaRepository.createUploadToken({
      userId: params.userId,
      mediaType: params.mediaType,
      expiresAt: new Date(Date.now() + this.uploadTokenExpiresIn),
      entityType: params.entityType,
      entityId: params.entityId,
    })

    return { uploadToken: newToken.id }
  }
}
