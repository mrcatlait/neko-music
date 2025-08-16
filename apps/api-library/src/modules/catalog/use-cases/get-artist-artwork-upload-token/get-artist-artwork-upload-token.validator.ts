import { Injectable } from '@nestjs/common'

import { ArtistRepository } from '../../repositories'
import { GetArtistArtworkUploadTokenUseCaseParams } from './get-artist-artwork-upload-token.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class GetArtistArtworkUploadTokenValidator implements Validator<GetArtistArtworkUploadTokenUseCaseParams> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async validate(params: GetArtistArtworkUploadTokenUseCaseParams): Promise<ValidationResult> {
    const artistExists = await this.artistRepository.exists(params.artistId)

    if (!artistExists) {
      return {
        isValid: false,
        errors: ['Artist not found'],
      }
    }

    return {
      isValid: true,
    }
  }
}
