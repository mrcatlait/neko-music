import { Module } from '@nestjs/common'

import { BACKSTAGE_MODULE_OPTIONS } from './tokens'
import {
  AddGenreValidator,
  AddGenreUseCase,
  CreateBackstageArtistValidator,
  CreateBackstageArtistUseCase,
  GetArtistStatisticsUseCase,
  GetBackstageArtistUseCase,
  PublishArtistValidator,
  PublishArtistUseCase,
  PublishAlbumValidator,
  PublishAlbumUseCase,
  GetGenreStatisticsUseCase,
  GetGenresUseCase,
  GetGenreUseCase,
  UpdateArtistStatusUseCase,
  UpdateArtistStatusValidator,
  UpdateBackstageArtistUseCase,
  UpdateBackstageArtistValidator,
  UpdateGenreValidator,
  UpdateGenreUseCase,
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
    CreateBackstageArtistUseCase,
    CreateBackstageArtistValidator,
    GetArtistStatisticsUseCase,
    GetBackstageArtistUseCase,
    GetGenreStatisticsUseCase,
    GetGenresUseCase,
    GetGenreUseCase,
    PublishArtistUseCase,
    PublishArtistValidator,
    PublishAlbumUseCase,
    PublishAlbumValidator,
    UpdateArtistStatusUseCase,
    UpdateArtistStatusValidator,
    UpdateBackstageArtistUseCase,
    UpdateBackstageArtistValidator,
    UpdateGenreUseCase,
    UpdateGenreValidator,
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
