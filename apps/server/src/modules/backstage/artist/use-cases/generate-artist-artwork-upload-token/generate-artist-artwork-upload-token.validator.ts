import { BadRequestException, Injectable } from '@nestjs/common'

import { ArtistRepository } from '../../repositories'
import { GenerateArtistArtworkUploadTokenUseCaseParams } from './generate-artist-artwork-upload-token.params'

import { Validator } from '@/modules/shared/types'

@Injectable()
export class GenerateArtistArtworkUploadTokenValidator implements Validator<GenerateArtistArtworkUploadTokenUseCaseParams> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async validate(params: GenerateArtistArtworkUploadTokenUseCaseParams): Promise<void> {
    const exists = await this.artistRepository.exists(params.artistId)

    if (!exists) {
      throw new BadRequestException('Artist not found')
    }
  }
}
