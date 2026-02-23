import { BadRequestException, Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { AddGenreValidator } from './add-genre.validator'
import { GenreRepository } from '../../../repositories'

import { GenreTable } from '@/modules/database'

export interface AddGenreUseCaseParams {
  readonly name: string
}

export type AddGenreUseCaseResult = Selectable<GenreTable>

@Injectable()
export class AddGenreUseCase {
  constructor(
    private readonly addGenreValidator: AddGenreValidator,
    private readonly genreRepository: GenreRepository,
  ) {}

  async invoke(params: AddGenreUseCaseParams): Promise<AddGenreUseCaseResult> {
    const validationResult = await this.addGenreValidator.validate(params)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    return this.genreRepository.createGenre({
      name: params.name,
    })
  }
}
