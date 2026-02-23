import { Injectable } from '@nestjs/common'

import { AddArtistUseCaseParams } from './add-artist.use-case'
import { ArtistRepository, GenreRepository } from '../../../repositories'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class AddArtistValidator implements Validator<AddArtistUseCaseParams> {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly genreRepository: GenreRepository,
  ) {}

  async validate(params: AddArtistUseCaseParams): Promise<ValidationResult> {
    const [nameTaken, genresExist] = await Promise.all([
      this.artistRepository.findArtistByName(params.name),
      this.genreRepository.findGenresByIds(params.genres),
    ])

    const errors: string[] = []

    if (nameTaken) {
      errors.push('Artist name already taken')
    }

    if (genresExist.length !== params.genres.length) {
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
