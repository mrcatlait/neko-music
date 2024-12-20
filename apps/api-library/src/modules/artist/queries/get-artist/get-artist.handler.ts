import { Injectable, NotFoundException } from '@nestjs/common'

import { ArtistEntity } from '../../entities'
import { ArtistRepository } from '../../repositories'
import { GetArtistQuery } from './get-artist.query'

import { QueryHandler } from '@modules/shared/models'

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
