import { Global, Module } from '@nestjs/common'

import { CreateArtistHandler, CreateArtistValidator, CreateGenreHandler, CreateGenreValidator } from './commands'
import { AlbumsController, ArtistController, GenreController } from './controllers'
import { GetArtistHandler, GetGenresHandler, GetPopularAlbumsHandler } from './queries'
import {
  ArtistImageRepository,
  ArtistGenreRepository,
  ArtistNoteRepository,
  ArtistRepository,
  GenreRepository,
  AlbumWithArtistsRepository,
  AlbumRepository,
} from './repositories'

@Global()
@Module({
  controllers: [AlbumsController, ArtistController, GenreController],
  providers: [
    // Commands
    CreateArtistHandler,
    CreateArtistValidator,
    CreateGenreHandler,
    CreateGenreValidator,
    // Queries
    GetArtistHandler,
    GetGenresHandler,
    GetPopularAlbumsHandler,
    // Repositories
    AlbumRepository,
    AlbumWithArtistsRepository,
    ArtistRepository,
    ArtistNoteRepository,
    ArtistGenreRepository,
    ArtistImageRepository,
    GenreRepository,
  ],
})
export class MusicMetadataModule {}
