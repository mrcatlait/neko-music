import { BadRequestException, Injectable } from '@nestjs/common'

import { GenerateArtistUploadTokenValidator } from './generate-artist-upload-token.validator'

import { GenerateUploadTokenUseCase } from '@/modules/media/use-cases'
import { EntityType, MediaType } from '@/modules/media/enums'

export interface GenerateArtistUploadTokenUseCaseParams {
  readonly artistId: string
  readonly userId: string
}

@Injectable()
export class GenerateArtistUploadTokenUseCase {
  constructor(
    private readonly generateArtistUploadTokenValidator: GenerateArtistUploadTokenValidator,
    private readonly generateUploadTokenUseCase: GenerateUploadTokenUseCase,
  ) {}

  async invoke(params: GenerateArtistUploadTokenUseCaseParams): Promise<{ uploadToken: string }> {
    const validationResult = await this.generateArtistUploadTokenValidator.validate(params)

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
