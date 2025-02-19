import { Injectable } from '@nestjs/common'

import { SagaStep } from '@modules/shared/saga'

import { CreateArtistSagaContext } from '../create-artist.saga'
import { ArtistNoteRepository } from '@modules/music-metadata/artist/repositories'

@Injectable()
export class CreateArtistNoteStep extends SagaStep<CreateArtistSagaContext> {
  constructor(private readonly artistNoteRepository: ArtistNoteRepository) {
    super()
  }

  async execute(): Promise<void> {
    if (!this.context.artistId) {
      throw new Error('Artist ID is required')
    }

    await this.artistNoteRepository.create({
      artistId: this.context.artistId,
      shortText: this.context.shortText,
      standardText: this.context.standardText,
    })
  }

  async compensate(): Promise<void> {
    if (!this.context.artistId) {
      throw new Error('Artist ID is required')
    }

    await this.artistNoteRepository.delete(this.context.artistId)
  }
}
