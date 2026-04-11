import { Injectable } from '@nestjs/common'

import { GenerateAlbumArtworkUploadTokenValidator } from './generate-album-artwork-upload-token.validator'

import { EntityType, MediaType } from '@/modules/media/enums'
import { GenerateUploadTokenUseCase, GenerateUploadTokenUseCaseResult } from '@/modules/media/use-cases'
import { UseCase } from '@/modules/shared/types'

export interface GenerateAlbumArtworkUploadTokenUseCaseParams {
  readonly albumId: string
  readonly userId: string
}

@Injectable()
export class GenerateAlbumArtworkUploadTokenUseCase implements UseCase<
  GenerateAlbumArtworkUploadTokenUseCaseParams,
  GenerateUploadTokenUseCaseResult
> {
  constructor(
    private readonly generateAlbumArtworkUploadTokenValidator: GenerateAlbumArtworkUploadTokenValidator,
    private readonly generateUploadTokenUseCase: GenerateUploadTokenUseCase,
  ) {}

  async invoke(params: GenerateAlbumArtworkUploadTokenUseCaseParams): Promise<GenerateUploadTokenUseCaseResult> {
    await this.generateAlbumArtworkUploadTokenValidator.validate(params)

    return this.generateUploadTokenUseCase.invoke({
      userId: params.userId,
      mediaType: MediaType.Image,
      entityType: EntityType.Album,
      entityId: params.albumId,
    })
  }
}
