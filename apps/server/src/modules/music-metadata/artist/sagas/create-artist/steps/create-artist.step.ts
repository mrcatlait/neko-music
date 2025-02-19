import { Injectable } from '@nestjs/common'

import { SagaStep } from '@modules/shared/saga'
import { ArtistRepository } from '@modules/music-metadata/artist/repositories'

import { CreateArtistSagaContext } from '../create-artist.saga'

@Injectable()
export class CreateArtistStep extends SagaStep<CreateArtistSagaContext> {
  constructor(private readonly artistRepository: ArtistRepository) {
    super()
  }

  async execute(): Promise<void> {
    const artist = await this.artistRepository.create({
      name: this.context.name,
      verified: this.context.verified,
    })

    this.context.artistId = artist.id
  }

  async compensate(): Promise<void> {
    if (!this.context.artistId) {
      throw new Error('Artist ID is required')
    }

    await this.artistRepository.delete(this.context.artistId)
  }
}
