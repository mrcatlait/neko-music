import { Global, Module } from '@nestjs/common'

import { CreateArtistHandler, CreateArtistValidator, CreateGenreHandler, CreateGenreValidator } from './commands'
import { ArtistController, GenreController } from './controllers'
import { GetArtistHandler, GetGenresHandler } from './queries'
import {
  ArtistImageRepository,
  ArtistGenreRepository,
  ArtistNoteRepository,
  ArtistRepository,
  GenreRepository,
} from './repositories'

@Global()
@Module({
  controllers: [ArtistController, GenreController],
  providers: [
    // Commands
    CreateArtistHandler,
    CreateArtistValidator,
    CreateGenreHandler,
    CreateGenreValidator,
    // Queries
    GetArtistHandler,
    GetGenresHandler,
    // Repositories
    ArtistRepository,
    ArtistNoteRepository,
    ArtistGenreRepository,
    ArtistImageRepository,
    GenreRepository,
  ],
})
export class MusicMetadataModule {}
