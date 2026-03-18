import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { AddGenreValidator } from './add-genre.validator'
import { GenreRepository } from '../../../repositories'

import { GenreTable } from '@/modules/catalog/catalog.schema'

export interface AddGenreUseCaseParams {
  readonly name: string
}

export type AddGenreUseCaseResult = Selectable<GenreTable>

// todo rename to CreateGenreUseCase
@Injectable()
export class AddGenreUseCase {
  constructor(
    private readonly addGenreValidator: AddGenreValidator,
    private readonly genreRepository: GenreRepository,
  ) {}

  async invoke(params: AddGenreUseCaseParams): Promise<AddGenreUseCaseResult> {
    await this.addGenreValidator.validate(params)

    return this.genreRepository.createGenre({
      name: params.name,
    })
  }
}
