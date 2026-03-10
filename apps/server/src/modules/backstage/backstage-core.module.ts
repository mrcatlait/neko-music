import { Module } from '@nestjs/common'

import { BACKSTAGE_MODULE_OPTIONS } from './tokens'
import {
  AddGenreValidator,
  AddGenreUseCase,
  CreateBackstageArtistValidator,
  CreateBackstageArtistUseCase,
  GetArtistStatisticsUseCase,
  PublishArtistValidator,
  PublishArtistUseCase,
  PublishAlbumValidator,
  PublishAlbumUseCase,
  GetGenreStatisticsUseCase,
  GetGenresUseCase,
  GetGenreUseCase,
  UpdateGenreValidator,
  UpdateGenreUseCase,
} from './use-cases'
import { AlbumController, ArtistController, GenreController } from './controllers'
import { AlbumRepository, ArtistRepository, GenreRepository, TrackRepository } from './repositories'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class BackstageCoreModule extends CoreModuleWithOptions {
  static module = BackstageCoreModule
  static optionsToken = BACKSTAGE_MODULE_OPTIONS
  static providers = [
    // Use cases
    AddGenreUseCase,
    AddGenreValidator,
    CreateBackstageArtistUseCase,
    CreateBackstageArtistValidator,
    GetArtistStatisticsUseCase,
    GetGenreStatisticsUseCase,
    GetGenresUseCase,
    GetGenreUseCase,
    PublishArtistUseCase,
    PublishArtistValidator,
    PublishAlbumUseCase,
    PublishAlbumValidator,
    UpdateGenreUseCase,
    UpdateGenreValidator,
    // Repositories
    AlbumRepository,
    ArtistRepository,
    GenreRepository,
    TrackRepository,
  ]
  static controllers = [AlbumController, ArtistController, GenreController]
}
