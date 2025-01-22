import { NotFoundError } from 'elysia'

import { ArtistRepository } from '../repositories'
import { ArtistEntity } from '../entities'

import { Handler } from '@common/models'
import { Container } from '@common/di'

interface GetArtistQueryParams {
  artistId: string
}

export class GetArtistQuery implements Handler<GetArtistQueryParams, ArtistEntity> {
  private readonly artistRepository: ArtistRepository

  constructor() {
    this.artistRepository = Container.get(ArtistRepository)
  }

  async handle(query: GetArtistQueryParams): Promise<ArtistEntity> {
    const artist = await this.artistRepository.getById(query.artistId)

    if (!artist) {
      throw new NotFoundError('Artist not found')
    }

    return artist
  }
}
