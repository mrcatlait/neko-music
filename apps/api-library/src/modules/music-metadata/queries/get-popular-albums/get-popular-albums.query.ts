import { Query } from '@nestjs/cqrs'

import { AlbumWithArtistsAndArtworkEntity } from '../../entities'

export class GetPopularAlbumsQuery extends Query<AlbumWithArtistsAndArtworkEntity[]> {}
