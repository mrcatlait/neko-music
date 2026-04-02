import { Module } from '@nestjs/common'

import { CATALOG_MODULE_OPTIONS } from './tokens'
import { CatalogGenresModule } from './genres/genres.module'
import { CatalogArtistModule } from './artist/artist.module'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class CatalogCoreModule extends CoreModuleWithOptions {
  static readonly module = CatalogCoreModule
  static readonly optionsToken = CATALOG_MODULE_OPTIONS
  static readonly imports = [CatalogGenresModule, CatalogArtistModule]
  static readonly exports = [CatalogGenresModule, CatalogArtistModule]
}
