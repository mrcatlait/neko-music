import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { GenreRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/types'
import { BackstageGenreTable } from '@/modules/backstage/backstage.schema'

export interface GetGenresUseCaseParameters {
  limit: number
  offset: number
}

export interface GetGenresUseCaseResult {
  data: Selectable<BackstageGenreTable>[]
  count: number
}

@Injectable()
export class GetGenresUseCase implements UseCase<GetGenresUseCaseParameters, GetGenresUseCaseResult> {
  constructor(private readonly genreRepository: GenreRepository) {}

  invoke({ limit, offset }: GetGenresUseCaseParameters): Promise<GetGenresUseCaseResult> {
    return this.genreRepository.findAll({ limit, offset })
  }
}
