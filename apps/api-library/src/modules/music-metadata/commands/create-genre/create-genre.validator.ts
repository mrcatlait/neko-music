import { Injectable } from '@nestjs/common'

import { CreateGenreCommand } from './create-genre.command'
import { GenreRepository } from '../../repositories'

import { ValidationResult, Validator } from '@modules/shared/models'

@Injectable()
export class CreateGenreValidator implements Validator<CreateGenreCommand> {
  constructor(private readonly repository: GenreRepository) {}

  async validate(command: CreateGenreCommand): Promise<ValidationResult> {
    const genreExists = await this.repository.exists(command.name)

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
