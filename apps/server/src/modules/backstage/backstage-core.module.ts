import { Module } from '@nestjs/common'

import { BACKSTAGE_MODULE_OPTIONS } from './tokens'
import {
  AddGenreValidator,
  AddGenreUseCase,
  CreateBackstageArtistValidator,
  CreateBackstageArtistUseCase,
  PublishArtistValidator,
  PublishArtistUseCase,
} from './use-cases'
import { ArtistController, GenreController } from './controllers'
import { ArtistRepository, GenreRepository } from './repositories'

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
    PublishArtistUseCase,
    PublishArtistValidator,
    // Repositories
    ArtistRepository,
    GenreRepository,
  ]
  static controllers = [ArtistController, GenreController]
}
