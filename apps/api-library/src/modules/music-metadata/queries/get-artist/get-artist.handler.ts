import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetArtistQuery } from './get-artist.query'

import { ArtistRepository } from '@modules/music-metadata/repositories'
import { ArtistEntity } from '@modules/music-metadata/entities'

@QueryHandler(GetArtistQuery)
export class GetArtistHandler implements IQueryHandler<GetArtistQuery, ArtistEntity> {
  constructor(private readonly artistRepository: ArtistRepository) {}

  async execute(query: GetArtistQuery): Promise<ArtistEntity> {
    const artist = await this.artistRepository.getById(query.id)

    if (!artist) {
      throw new NotFoundException('Artist not found')
    }

    return artist
  }
}
