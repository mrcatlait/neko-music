import { Injectable } from '@nestjs/common'

import { GenreRepository } from '../../../repositories'
import { GenreStatisticsEntity } from '../../../entities'

export type GetGenreStatisticsUseCaseResult = GenreStatisticsEntity[]

@Injectable()
export class GetGenreStatisticsUseCase {
  constructor(private readonly genreRepository: GenreRepository) {}

  async invoke(): Promise<GenreStatisticsEntity[]> {
    return this.genreRepository.getGenreStatistics()
  }
}
