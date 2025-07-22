import { Global, Module } from '@nestjs/common'

import { AlbumsController, ArtistController, GenreController } from './controllers'
import { GetArtistHandler, GetGenresHandler, GetPopularAlbumsHandler } from './queries'
import { GenreRepository, AlbumRepository, ArtistRepository, TrackRepository } from './repositories'

@Global()
@Module({
  controllers: [AlbumsController, ArtistController, GenreController],
  providers: [
    // Commands
    // Queries
    GetArtistHandler,
    GetGenresHandler,
    GetPopularAlbumsHandler,
    // Repositories
    AlbumRepository,
    ArtistRepository,
    GenreRepository,
    TrackRepository,
  ],
})
export class MusicMetadataModule {}
