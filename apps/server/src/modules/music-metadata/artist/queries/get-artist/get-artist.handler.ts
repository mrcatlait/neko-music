import { Injectable, NotFoundException } from '@nestjs/common'

import { GetArtistQuery } from './get-artist.query'

import { QueryHandler } from '@modules/shared/models'
import { ArtistRepository } from '@modules/music-metadata/artist/repositories'
import { ArtistEntity } from '@modules/music-metadata/artist/entities'

@Injectable()
export class GetArtistHandler implements QueryHandler<GetArtistQuery, ArtistEntity> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async handle(query: GetArtistQuery): Promise<ArtistEntity> {
    const artist = await this.artistRepository.getById(query.id)

    if (!artist) {
      throw new NotFoundException('Artist not found')
    }

    return artist
  }
}
