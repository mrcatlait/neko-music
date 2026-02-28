import { Module } from '@nestjs/common'

import { CATALOG_MODULE_OPTIONS } from './tokens'
import { CreateCatalogArtistUseCase, CreateCatalogArtistValidator } from './use-cases'
import { ArtistRepository, GenreRepository } from './repositories'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class CatalogCoreModule extends CoreModuleWithOptions {
  static module = CatalogCoreModule
  static optionsToken = CATALOG_MODULE_OPTIONS
  static providers = [
    // Repositories
    ArtistRepository,
    GenreRepository,
    // Use cases
    CreateCatalogArtistUseCase,
    CreateCatalogArtistValidator,
  ]
  static controllers = []
  static exports = [CreateCatalogArtistUseCase, CreateCatalogArtistValidator]
}
