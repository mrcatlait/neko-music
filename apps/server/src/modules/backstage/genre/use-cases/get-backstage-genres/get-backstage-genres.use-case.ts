import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { GenreRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/types'
import { BackstageGenreTable } from '@/modules/backstage/backstage.schema'

export interface GetBackstageGenresUseCaseParameters {
  limit?: number
  offset?: number
  search?: string
  ids?: string[]
}

export interface GetBackstageGenresUseCaseResult {
  data: Selectable<BackstageGenreTable>[]
  count: number
}

@Injectable()
export class GetBackstageGenresUseCase implements UseCase<
  GetBackstageGenresUseCaseParameters,
  GetBackstageGenresUseCaseResult
> {
  constructor(private readonly genreRepository: GenreRepository) {}

  invoke({
    limit,
    offset,
    search,
    ids,
  }: GetBackstageGenresUseCaseParameters): Promise<GetBackstageGenresUseCaseResult> {
    return this.genreRepository.findAll({ limit, offset, search, ids })
  }
}
