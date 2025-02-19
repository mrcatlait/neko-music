import { Global, Module } from '@nestjs/common'

import { CreateArtistHandler, CreateArtistValidator } from './artist/commands'
import { ArtistController } from './infrastructure/controllers'
import { GetArtistHandler } from './artist/queries'
import {
  CreateArtistSaga,
  CreateArtistGenreStep,
  CreateArtistNoteStep,
  CreateArtistStep,
} from './artist/sagas/create-artist'
import {
  ArtistImageRepository,
  ArtistGenreRepository,
  ArtistNoteRepository,
  ArtistRepository,
} from './artist/repositories'

@Global()
@Module({
  controllers: [ArtistController],
  providers: [
    // Handlers
    GetArtistHandler,
    CreateArtistHandler,
    CreateArtistValidator,
    // Sagas
    CreateArtistSaga,
    // Steps
    CreateArtistStep,
    CreateArtistNoteStep,
    CreateArtistGenreStep,
    // Repositories
    ArtistRepository,
    ArtistNoteRepository,
    ArtistGenreRepository,
    ArtistImageRepository,
  ],
})
export class MusicMetadataModule {}
