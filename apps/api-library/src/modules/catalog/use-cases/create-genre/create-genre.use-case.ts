import { BadRequestException, Injectable } from '@nestjs/common'

import { CreateGenreValidator } from './create-genre.validator'
import { GenreRepository } from '../../repositories'
import { GenreEntity } from '../../entities'

export interface CreateGenreUseCaseParams {
  readonly name: string
}

@Injectable()
export class CreateGenreUseCase {
  constructor(
    private readonly createGenreValidator: CreateGenreValidator,
    private readonly repository: GenreRepository,
  ) {}

  async invoke(params: CreateGenreUseCaseParams): Promise<GenreEntity> {
    const validationResult = await this.createGenreValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.repository.create({
      name: params.name,
    })
  }
}
