import { Query } from '@nestjs/cqrs'

import { TrackWithAlbumAndArtistsEntity } from '../../entities'

export class GetTracksForAlbumQuery extends Query<TrackWithAlbumAndArtistsEntity[]> {
  constructor(readonly id: string) {
    super()
  }
}
