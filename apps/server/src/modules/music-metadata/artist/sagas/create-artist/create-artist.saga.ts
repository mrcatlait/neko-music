import { Injectable } from '@nestjs/common'

import { Saga } from '@modules/shared/saga'

import { CreateArtistGenreStep, CreateArtistNoteStep, CreateArtistStep } from './steps'

export interface CreateArtistSagaContext {
  name: string
  verified: boolean
  genres: string[]
  shortText: string
  standardText: string
  artistId?: string
}

@Injectable()
export class CreateArtistSaga extends Saga {
  constructor(
    private readonly createArtistStep: CreateArtistStep,
    private readonly createArtistNoteStep: CreateArtistNoteStep,
    private readonly createArtistGenreStep: CreateArtistGenreStep,
  ) {
    super()
  }

  protected steps = [this.createArtistStep, this.createArtistNoteStep, this.createArtistGenreStep]
}
