import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { AlbumWithArtistsRepository } from '../../repositories'
import { AlbumWithArtistsEntity } from '../../entities'
import { GetPopularAlbumsQuery } from './get-popular-albums.query'

@QueryHandler(GetPopularAlbumsQuery)
export class GetPopularAlbumsHandler implements IQueryHandler<GetPopularAlbumsQuery> {
  constructor(private readonly albumWithArtistsRepository: AlbumWithArtistsRepository) {}

  execute(): Promise<AlbumWithArtistsEntity[]> {
    return this.albumWithArtistsRepository.findPopular()
  }
}
