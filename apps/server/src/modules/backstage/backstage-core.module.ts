import { Module } from '@nestjs/common'

import { BACKSTAGE_MODULE_OPTIONS } from './tokens'
import {
  AddGenreValidator,
  AddGenreUseCase,
  CreateBackstageArtistValidator,
  CreateBackstageArtistUseCase,
  PublishArtistValidator,
  PublishArtistUseCase,
  PublishAlbumValidator,
  PublishAlbumUseCase,
  GetGenreStatisticsUseCase,
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
    GetGenreStatisticsUseCase,
    PublishArtistUseCase,
    PublishArtistValidator,
    PublishAlbumUseCase,
    PublishAlbumValidator,
    // Repositories
    AlbumRepository,
    ArtistRepository,
    GenreRepository,
    TrackRepository,
  ]
  static controllers = [AlbumController, ArtistController, GenreController]
}
