import { Query } from '@nestjs/cqrs'

import { ArtistEntity } from '@modules/music-metadata/entities'

export class GetArtistQuery extends Query<ArtistEntity> {
  constructor(readonly id: string) {
    super()
  }
}
