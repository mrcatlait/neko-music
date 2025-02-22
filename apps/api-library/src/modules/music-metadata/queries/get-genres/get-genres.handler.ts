import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetGenresQuery } from './get-genres.query'

import { GenreEntity } from '@modules/music-metadata/entities'
import { GenreRepository } from '@modules/music-metadata/repositories'

@QueryHandler(GetGenresQuery)
export class GetGenresHandler implements IQueryHandler<GetGenresQuery> {
  constructor(private readonly genreRepository: GenreRepository) {}

  execute(): Promise<GenreEntity[]> {
    return this.genreRepository.findAll()
  }
}
