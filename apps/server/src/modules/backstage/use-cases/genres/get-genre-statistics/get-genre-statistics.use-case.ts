import { Injectable } from '@nestjs/common'

import { GenreRepository } from '../../../repositories'
import { GenreStatisticsEntity } from '../../../entities'

import { UseCase } from '@/modules/shared/interfaces'

export type GetGenreStatisticsUseCaseResult = GenreStatisticsEntity[]

@Injectable()
export class GetGenreStatisticsUseCase implements UseCase<void, GetGenreStatisticsUseCaseResult> {
  constructor(private readonly genreRepository: GenreRepository) {}

  invoke(): Promise<GenreStatisticsEntity[]> {
    return this.genreRepository.getGenreStatistics()
  }
}
