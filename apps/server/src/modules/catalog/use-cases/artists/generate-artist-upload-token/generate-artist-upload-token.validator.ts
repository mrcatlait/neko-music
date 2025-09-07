import { Injectable } from '@nestjs/common'

import { ArtistRepository } from '../../../repositories'
import { GenerateArtistUploadTokenUseCaseParams } from './generate-artist-upload-token.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class GenerateArtistUploadTokenValidator implements Validator<GenerateArtistUploadTokenUseCaseParams> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async validate(params: GenerateArtistUploadTokenUseCaseParams): Promise<ValidationResult> {
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
