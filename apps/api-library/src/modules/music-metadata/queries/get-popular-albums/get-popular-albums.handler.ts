import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { AlbumRepository } from '../../repositories'
import { AlbumWithArtistsAndArtworkEntity } from '../../entities'
import { GetPopularAlbumsQuery } from './get-popular-albums.query'

@QueryHandler(GetPopularAlbumsQuery)
export class GetPopularAlbumsHandler implements IQueryHandler<GetPopularAlbumsQuery> {
  constructor(private readonly repository: AlbumRepository) {}

  execute(): Promise<AlbumWithArtistsAndArtworkEntity[]> {
    return this.repository.findPopular()
  }
}
