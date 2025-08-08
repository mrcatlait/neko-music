import { Injectable } from '@nestjs/common'

import { AlbumRepository } from '../../repositories'
import { AlbumEntity, WithArtistArtworks, WithArtists } from '../../entities'

type AlbumWithArtistsAndArtworkEntity = WithArtists<WithArtistArtworks<AlbumEntity>>

@Injectable()
export class GetPopularAlbumsUseCase {
  constructor(private readonly repository: AlbumRepository) {}

  async invoke(): Promise<AlbumWithArtistsAndArtworkEntity[]> {
    return this.repository.findPopular()
  }
}
