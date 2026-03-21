import { Module } from '@nestjs/common'

import { CATALOG_MODULE_OPTIONS } from './tokens'
import { CreateCatalogAlbumUseCase, CreateCatalogAlbumValidator } from './use-cases/albums'
import {
  CreateCatalogArtistUseCase,
  CreateCatalogArtistValidator,
  GetCatalogArtistsUseCase,
  UpdateCatalogArtistUseCase,
  UpdateCatalogArtistValidator,
} from './use-cases/artists'
import { AlbumRepository, ArtistRepository, GenreRepository } from './repositories'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class CatalogCoreModule extends CoreModuleWithOptions {
  static readonly module = CatalogCoreModule
  static readonly optionsToken = CATALOG_MODULE_OPTIONS
  static readonly providers = [
    // Repositories
    AlbumRepository,
    ArtistRepository,
    GenreRepository,
    // Use cases
    CreateCatalogAlbumUseCase,
    CreateCatalogAlbumValidator,
    CreateCatalogArtistUseCase,
    CreateCatalogArtistValidator,
    GetCatalogArtistsUseCase,
    UpdateCatalogArtistUseCase,
    UpdateCatalogArtistValidator,
  ]
  static readonly controllers = []
  static readonly exports = [
    CreateCatalogAlbumUseCase,
    CreateCatalogAlbumValidator,
    CreateCatalogArtistUseCase,
    CreateCatalogArtistValidator,
    GetCatalogArtistsUseCase,
    UpdateCatalogArtistUseCase,
    UpdateCatalogArtistValidator,
  ]
}
