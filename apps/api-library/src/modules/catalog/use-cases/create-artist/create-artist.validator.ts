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
    const [artistExists, genresExist] = await Promise.all([
      this.artistRepository.existsByName(params.name),
      this.genreRepository.existsMany(params.genres),
    ])

    const errors: string[] = []

    if (artistExists) {
      errors.push('Artist already exists')
    }

    if (!genresExist) {
      errors.push('Genres not found')
    }

    if (errors.length > 0) {
      return {
        isValid: false,
        errors,
      }
    }

    return {
      isValid: true,
    }
  }
}
