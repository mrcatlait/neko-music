import { Injectable } from '@nestjs/common'

import { AlbumRepository } from '../../repositories'
import { AlbumEntity, WithArtists, WithArtwork } from '../../entities'

type AlbumWithArtistsAndArtworkEntity = WithArtists<WithArtwork<AlbumEntity>>

@Injectable()
export class GetPopularAlbumsUseCase {
  constructor(private readonly repository: AlbumRepository) {}

  async invoke(): Promise<AlbumWithArtistsAndArtworkEntity[]> {
    return this.repository.findPopular()
  }
}
