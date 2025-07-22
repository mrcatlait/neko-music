import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetTracksForAlbumQuery } from './get-tracks-for-album.query'
import { TrackWithAlbumAndArtistsEntity } from '../../entities'
import { TrackRepository } from '../../repositories'

@QueryHandler(GetTracksForAlbumQuery)
export class GetTracksForAlbumHandler implements IQueryHandler<GetTracksForAlbumQuery> {
  constructor(private readonly repository: TrackRepository) {}

  execute(query: GetTracksForAlbumQuery): Promise<TrackWithAlbumAndArtistsEntity[]> {
    return this.repository.findByAlbumId(query.id)
  }
}
