import { Injectable } from '@nestjs/common'

import { GenerateArtistArtworkUploadTokenValidator } from './generate-artist-artwork-upload-token.validator'

import { EntityType, MediaType } from '@/modules/media/enums'
import { GenerateUploadTokenUseCase, GenerateUploadTokenUseCaseResult } from '@/modules/media/use-cases'
import { UseCase } from '@/modules/shared/types'

export interface GenerateArtistArtworkUploadTokenUseCaseParams {
  readonly artistId: string
  readonly userId: string
}

@Injectable()
export class GenerateArtistArtworkUploadTokenUseCase implements UseCase<
  GenerateArtistArtworkUploadTokenUseCaseParams,
  GenerateUploadTokenUseCaseResult
> {
  constructor(
    private readonly validator: GenerateArtistArtworkUploadTokenValidator,
    private readonly generateUploadTokenUseCase: GenerateUploadTokenUseCase,
  ) {}

  async invoke(params: GenerateArtistArtworkUploadTokenUseCaseParams): Promise<GenerateUploadTokenUseCaseResult> {
    await this.validator.validate(params)

    return this.generateUploadTokenUseCase.invoke({
      userId: params.userId,
      mediaType: MediaType.Image,
      entityType: EntityType.Artist,
      entityId: params.artistId,
    })
  }
}
