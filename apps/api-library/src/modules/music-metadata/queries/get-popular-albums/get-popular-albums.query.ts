import { Query } from '@nestjs/cqrs'

import { AlbumWithArtistsAndArtworkDto } from '../../dtos'

export class GetPopularAlbumsQuery extends Query<AlbumWithArtistsAndArtworkDto[]> {}
