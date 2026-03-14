import { Injectable } from '@nestjs/common'

import { UpdateGenreUseCaseParams } from './update-genre.use-case'
import { GenreRepository } from '../../../repositories'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class UpdateGenreValidator implements Validator<UpdateGenreUseCaseParams> {
  constructor(private readonly genreRepository: GenreRepository) {}

  async validate(params: UpdateGenreUseCaseParams): Promise<ValidationResult> {
    const [genreExists, hasGenre] = await Promise.all([
      this.genreRepository.findGenreByName(params.name),
      this.genreRepository.findGenreById(params.id),
    ])

    if (!hasGenre) {
      return {
        isValid: false,
        error: 'Genre not found',
      }
    }

    if (genreExists) {
      return {
        isValid: false,
        error: 'Genre already exists',
      }
    }

    return {
      isValid: true,
    }
  }
}
