import { Module } from '@nestjs/common'

import { BACKSTAGE_MODULE_OPTIONS } from './tokens'
import { AddArtistValidator, AddArtistUseCase, AddGenreValidator, AddGenreUseCase } from './use-cases'
import { ArtistController, GenreController } from './controllers'
import { ArtistRepository, GenreRepository } from './repositories'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class BackstageCoreModule extends CoreModuleWithOptions {
  static module = BackstageCoreModule
  static optionsToken = BACKSTAGE_MODULE_OPTIONS
  static providers = [
    // Use cases
    AddArtistUseCase,
    AddArtistValidator,
    AddGenreUseCase,
    AddGenreValidator,
    // Repositories
    ArtistRepository,
    GenreRepository,
  ]
  static controllers = [ArtistController, GenreController]
}
