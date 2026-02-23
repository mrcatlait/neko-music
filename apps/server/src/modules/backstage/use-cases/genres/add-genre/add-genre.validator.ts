import { Injectable } from '@nestjs/common'

import { AddGenreUseCaseParams } from './add-genre.use-case'
import { GenreRepository } from '../../../repositories'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class AddGenreValidator implements Validator<AddGenreUseCaseParams> {
  constructor(private readonly genreRepository: GenreRepository) {}

  async validate(params: AddGenreUseCaseParams): Promise<ValidationResult> {
    const genreExists = await this.genreRepository.findGenreByName(params.name)

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
