import { Injectable } from '@nestjs/common'

import { ArtistRepository, GenreRepository } from '../../repositories'
import { CreateArtistUseCaseParams } from './create-artist.use-case'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class CreateArtistValidator implements Validator<CreateArtistUseCaseParams> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: CreateArtistUseCaseParams): Promise<ValidationResult> {
    const artistExists = await this.artistRepository.exists(params.name)

    if (artistExists) {
      return {
        isValid: false,
        errors: ['Artist already exists'],
      }
    }

    const genresExist = await this.genreRepository.existsAll(params.genres)

    if (!genresExist) {
      return {
        isValid: false,
        errors: ['Genres not found'],
      }
    }

    return {
      isValid: true,
    }
  }
}
