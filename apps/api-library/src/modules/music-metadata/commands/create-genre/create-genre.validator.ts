import { Injectable } from '@nestjs/common'
import { ValidationResult, Validator } from '@modules/shared/models'

import { CreateGenreCommand } from './create-genre.command'
import { GenreRepository } from '../../repositories'

@Injectable()
export class CreateGenreValidator implements Validator<CreateGenreCommand> {
  constructor(private readonly genreRepository: GenreRepository) {}

  async validate(command: CreateGenreCommand): Promise<ValidationResult> {
    const genreExists = await this.genreRepository.findOneByName(command.name)

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
