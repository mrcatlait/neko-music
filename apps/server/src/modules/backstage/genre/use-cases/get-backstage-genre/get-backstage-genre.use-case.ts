import { Injectable, NotFoundException } from '@nestjs/common'
import { Selectable } from 'kysely'

import { GenreRepository } from '../../repositories'

import { UseCase } from '@/modules/shared/types'
import { BackstageGenreTable } from '@/modules/backstage/backstage.schema'

export interface GetBackstageGenreUseCaseParams {
  readonly id: string
}

export type GetBackstageGenreUseCaseResult = Selectable<BackstageGenreTable>

@Injectable()
export class GetBackstageGenreUseCase implements UseCase<
  GetBackstageGenreUseCaseParams,
  GetBackstageGenreUseCaseResult
> {
  constructor(private readonly genreRepository: GenreRepository) {}

  invoke({ id }: GetBackstageGenreUseCaseParams): Promise<GetBackstageGenreUseCaseResult> {
    return this.genreRepository.findOne(id).then((genre) => {
      if (!genre) {
        throw new NotFoundException('Genre not found')
      }

      return genre
    })
  }
}
