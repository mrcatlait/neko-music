import { Injectable } from '@nestjs/common'

import { SagaStep } from '@modules/shared/saga'

import { CreateArtistSagaContext } from '../create-artist.saga'
import { ArtistGenreRepository } from '@modules/music-metadata/artist/repositories'

@Injectable()
export class CreateArtistGenreStep extends SagaStep<CreateArtistSagaContext> {
  constructor(private readonly artistGenreRepository: ArtistGenreRepository) {
    super()
  }

  async execute(): Promise<void> {
    const artistId = this.context.artistId

    if (!artistId) {
      throw new Error('Artist ID is required')
    }

    await this.artistGenreRepository.createMany(
      this.context.genres.map((genre, index) => ({
        artist_id: artistId,
        genre_id: genre,
        position: index,
      })),
    )
  }

  async compensate(): Promise<void> {
    const artistId = this.context.artistId

    if (!artistId) {
      throw new Error('Artist ID is required')
    }

    await this.artistGenreRepository.deleteMany(
      this.context.genres.map((genre) => ({
        artist_id: artistId,
        genre_id: genre,
      })),
    )
  }
}
