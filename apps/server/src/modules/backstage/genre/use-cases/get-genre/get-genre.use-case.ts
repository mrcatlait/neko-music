import { Injectable, NotFoundException } from '@nestjs/common'
import { Selectable } from 'kysely'

import { GenreRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/types'
import { BackstageGenreTable } from '@/modules/backstage/backstage.schema'

export interface GetGenreUseCaseParams {
  readonly id: string
}

export type GetGenreUseCaseResult = Selectable<BackstageGenreTable>

@Injectable()
export class GetGenreUseCase implements UseCase<GetGenreUseCaseParams, GetGenreUseCaseResult> {
  constructor(private readonly genreRepository: GenreRepository) {}

  invoke({ id }: GetGenreUseCaseParams): Promise<GetGenreUseCaseResult> {
    return this.genreRepository.findOne(id).then((genre) => {
      if (!genre) {
        throw new NotFoundException('Genre not found')
      }

      return genre
    })
  }
}
