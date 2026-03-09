import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'

import { GenreRepository } from '@/modules/backstage/repositories'
import { UseCase } from '@/modules/shared/interfaces'
import { GenreTable } from '@/modules/database'

export type GetGenresUseCaseResult = Selectable<GenreTable>[]

@Injectable()
export class GetGenresUseCase implements UseCase<void, GetGenresUseCaseResult> {
  constructor(private readonly genreRepository: GenreRepository) {}

  invoke(): Promise<Selectable<GenreTable>[]> {
    return this.genreRepository.findAllGenres()
  }
}
