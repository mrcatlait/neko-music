import { Injectable } from '@nestjs/common'

import { ArtistRepository, GenreRepository } from '../../repositories'
import { UpdateArtistUseCaseParams } from './update-artist.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class UpdateArtistValidator implements Validator<UpdateArtistUseCaseParams> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: UpdateArtistUseCaseParams): Promise<ValidationResult> {
    const artistExists = await this.artistRepository.exists(params.id)

    if (!artistExists) {
      return {
        isValid: false,
        errors: ['Artist not found'],
      }
    }

    if (params.genres) {
      const genresExist = await this.genreRepository.existsMany(params.genres)

      if (!genresExist) {
        return {
          isValid: false,
          errors: ['Genres not found'],
        }
      }
    }

    return {
      isValid: true,
    }
  }
}
