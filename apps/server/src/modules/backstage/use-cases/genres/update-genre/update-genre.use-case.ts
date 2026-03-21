import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { UpdateGenreValidator } from './update-genre.validator'

import { GenreRepository } from '@/modules/backstage/repositories'
import { GenreTable } from '@/modules/catalog/catalog.schema'
import { UseCase } from '@/modules/shared/types'

export interface UpdateGenreUseCaseParams {
  readonly id: string
  readonly name: string
}

export type UpdateGenreUseCaseResult = Selectable<GenreTable>

@Injectable()
export class UpdateGenreUseCase implements UseCase<UpdateGenreUseCaseParams, UpdateGenreUseCaseResult> {
  constructor(
    private readonly updateGenreValidator: UpdateGenreValidator,
    private readonly genreRepository: GenreRepository,
  ) {}

  async invoke(params: UpdateGenreUseCaseParams): Promise<UpdateGenreUseCaseResult> {
    await this.updateGenreValidator.validate(params)

    return this.genreRepository.updateGenre({
      id: params.id,
      name: params.name,
    })
  }
}
