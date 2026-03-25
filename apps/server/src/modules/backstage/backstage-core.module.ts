import { Module } from '@nestjs/common'

import { BACKSTAGE_MODULE_OPTIONS } from './tokens'
import {
  AddGenreValidator,
  AddGenreUseCase,
  CreateBackstageArtistValidator,
  CreateBackstageArtistUseCase,
  GetArtistStatisticsUseCase,
  GetBackstageArtistUseCase,
  PublishAlbumValidator,
  PublishAlbumUseCase,
  GetGenresUseCase,
  GetGenreUseCase,
  UpdateArtistStatusUseCase,
  UpdateArtistStatusValidator,
  UpdateBackstageArtistUseCase,
  UpdateBackstageArtistValidator,
  UpdateGenreValidator,
  UpdateGenreUseCase,
  SyncArtistValidator,
  SyncArtistUseCase,
  CreateBackstageAlbumUseCase,
  CreateBackstageAlbumValidator,
  CreateBackstageTrackUseCase,
  CreateBackstageTrackValidator,
  GetBackstageArtistsUseCase,
} from './use-cases'
import { AlbumController, ArtistController, GenreController } from './controllers'
import { AlbumRepository, ArtistRepository, GenreRepository, TrackRepository } from './repositories'
import { ArtistListener } from './listeners'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class BackstageCoreModule extends CoreModuleWithOptions {
  static readonly module = BackstageCoreModule
  static readonly optionsToken = BACKSTAGE_MODULE_OPTIONS
  static readonly providers = [
    // Use cases
    AddGenreUseCase,
    AddGenreValidator,
    CreateBackstageAlbumUseCase,
    CreateBackstageAlbumValidator,
    CreateBackstageArtistUseCase,
    CreateBackstageArtistValidator,
    CreateBackstageTrackUseCase,
    CreateBackstageTrackValidator,
    GetBackstageArtistsUseCase,
    GetArtistStatisticsUseCase,
    GetBackstageArtistUseCase,
    GetGenresUseCase,
    GetGenreUseCase,
    PublishAlbumUseCase,
    PublishAlbumValidator,
    UpdateArtistStatusUseCase,
    UpdateArtistStatusValidator,
    UpdateBackstageArtistUseCase,
    UpdateBackstageArtistValidator,
    UpdateGenreUseCase,
    UpdateGenreValidator,
    SyncArtistUseCase,
    SyncArtistValidator,
    // Repositories
    AlbumRepository,
    ArtistRepository,
    GenreRepository,
    TrackRepository,
    // Listeners
    ArtistListener,
  ]
  static readonly controllers = [AlbumController, ArtistController, GenreController]
}
