import { Elysia } from 'elysia'

import { ArtistRepository, artistRepositoryDecorator } from '../repositories'

export class ArtistService {
  constructor(private readonly repository: ArtistRepository) {}

  async getById(id: string): Promise<string> {
    const result = await this.repository.getById(id)
    return result + '1'
  }
}

export const artistServiceDecorator = new Elysia({ name: `service/artist` })
  .use(artistRepositoryDecorator)
  .decorate((ctx) => ({
    artistService: new ArtistService(ctx.artistRepository),
  }))
