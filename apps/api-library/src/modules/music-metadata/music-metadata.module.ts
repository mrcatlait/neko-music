import { Global, Module } from '@nestjs/common'

import { AlbumsController, ArtistController, GenreController } from './controllers'
import { GetArtistHandler, GetPopularAlbumsHandler, GetTracksForAlbumHandler } from './queries'
import {
  GenreRepository,
  AlbumRepository,
  ArtistRepository,
  TrackRepository,
  AlbumArtistRepository,
  AlbumGenreRepository,
  ArtistGenreRepository,
} from './repositories'
import {
  CreateAlbumHandler,
  CreateAlbumValidator,
  CreateArtistHandler,
  CreateArtistValidator,
  CreateGenreHandler,
  CreateGenreValidator,
} from './commands'

@Global()
@Module({
  controllers: [AlbumsController, ArtistController, GenreController],
  providers: [
    // Commands
    CreateAlbumHandler,
    CreateAlbumValidator,
    CreateArtistHandler,
    CreateArtistValidator,
    CreateGenreHandler,
    CreateGenreValidator,
    // Queries
    GetArtistHandler,
    GetPopularAlbumsHandler,
    GetTracksForAlbumHandler,
    // Repositories
    AlbumArtistRepository,
    AlbumGenreRepository,
    AlbumRepository,
    ArtistGenreRepository,
    ArtistRepository,
    GenreRepository,
    TrackRepository,
  ],
})
export class MusicMetadataModule {}
