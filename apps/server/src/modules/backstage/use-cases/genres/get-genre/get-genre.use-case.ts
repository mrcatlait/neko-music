import { Injectable, NotFoundException } from '@nestjs/common'
import { Selectable } from 'kysely'

import { GenreTable } from '@/modules/catalog/catalog.schema'
import { UseCase } from '@/modules/shared/types'
import { GenreRepository } from '@/modules/backstage/repositories'

export type GetGenreUseCaseResult = Selectable<GenreTable>

@Injectable()
export class GetGenreUseCase implements UseCase<string, GetGenreUseCaseResult> {
  constructor(private readonly genreRepository: GenreRepository) {}

  invoke(id: string): Promise<GetGenreUseCaseResult> {
    return this.genreRepository.findGenreById(id).then((genre) => {
      if (!genre) {
        throw new NotFoundException('Genre not found')
      }

      return genre
    })
  }
}
