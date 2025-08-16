import { BadRequestException, Injectable } from '@nestjs/common'

import { GetArtistArtworkUploadTokenValidator } from './get-artist-artwork-upload-token.validator'

import { GenerateUploadTokenUseCase } from '@/modules/media/use-cases'
import { EntityType, MediaType } from '@/modules/media/enums'

export interface GetArtistArtworkUploadTokenUseCaseParams {
  readonly artistId: string
  readonly userId: string
}

@Injectable()
export class GetArtistArtworkUploadTokenUseCase {
  constructor(
    private readonly getArtistArtworkUploadTokenValidator: GetArtistArtworkUploadTokenValidator,
    private readonly generateUploadTokenUseCase: GenerateUploadTokenUseCase,
  ) {}

  async invoke(params: GetArtistArtworkUploadTokenUseCaseParams): Promise<{ uploadToken: string }> {
    const validationResult = await this.getArtistArtworkUploadTokenValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.generateUploadTokenUseCase.invoke({
      userId: params.userId,
      mediaType: MediaType.ARTWORK,
      entityType: EntityType.ARTIST,
      entityId: params.artistId,
    })
  }
}
