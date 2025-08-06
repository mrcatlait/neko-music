import { Injectable } from '@nestjs/common'
import { ValidationResult, Validator } from '@modules/shared/models'

import { GenreRepository } from '../../repositories'
import { CreateGenreUseCaseParams } from './create-genre.use-case'

@Injectable()
export class CreateGenreValidator implements Validator<CreateGenreUseCaseParams> {
  constructor(private readonly repository: GenreRepository) {}

  async validate(params: CreateGenreUseCaseParams): Promise<ValidationResult> {
    const genreExists = await this.repository.exists(params.name)

    if (genreExists) {
      return {
        isValid: false,
        errors: ['Genre already exists'],
      }
    }

    return {
      isValid: true,
    }
  }
}
