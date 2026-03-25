import { Injectable, NotFoundException } from '@nestjs/common'
import { Selectable } from 'kysely'

import { UseCase } from '@/modules/shared/types'
import { GenreRepository } from '@/modules/backstage/repositories'
import { BackstageGenreTable } from '@/modules/backstage/backstage.schema'

export type GetGenreUseCaseResult = Selectable<BackstageGenreTable>

@Injectable()
export class GetGenreUseCase implements UseCase<string, GetGenreUseCaseResult> {
  constructor(private readonly genreRepository: GenreRepository) {}

  invoke(id: string): Promise<GetGenreUseCaseResult> {
    return this.genreRepository.findOne(id).then((genre) => {
      if (!genre) {
        throw new NotFoundException('Genre not found')
      }

      return genre
    })
  }
}
