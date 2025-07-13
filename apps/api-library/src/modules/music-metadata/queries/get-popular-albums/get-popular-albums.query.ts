import { Query } from '@nestjs/cqrs'

import { AlbumWithArtistsEntity } from '../../entities'

export class GetPopularAlbumsQuery extends Query<AlbumWithArtistsEntity[]> {}
