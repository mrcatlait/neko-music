import { Module } from '@nestjs/common'

import { CATALOG_MODULE_OPTIONS } from './tokens'
import { CreateCatalogAlbumUseCase, CreateCatalogAlbumValidator } from './use-cases/albums'
import { CreateCatalogArtistUseCase, CreateCatalogArtistValidator } from './use-cases/artists'
import { AlbumRepository, ArtistRepository, GenreRepository } from './repositories'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class CatalogCoreModule extends CoreModuleWithOptions {
  static module = CatalogCoreModule
  static optionsToken = CATALOG_MODULE_OPTIONS
  static providers = [
    // Repositories
    AlbumRepository,
    ArtistRepository,
    GenreRepository,
    // Use cases
    CreateCatalogAlbumUseCase,
    CreateCatalogAlbumValidator,
    CreateCatalogArtistUseCase,
    CreateCatalogArtistValidator,
  ]
  static controllers = []
  static exports = [
    CreateCatalogAlbumUseCase,
    CreateCatalogAlbumValidator,
    CreateCatalogArtistUseCase,
    CreateCatalogArtistValidator,
  ]
}
