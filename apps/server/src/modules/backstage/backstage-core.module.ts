import { Module } from '@nestjs/common'

import { BACKSTAGE_MODULE_OPTIONS } from './tokens'
import { BackstageArtistModule } from './artist/artist.module'
import { BackstageGenreModule } from './genre/genre.module'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class BackstageCoreModule extends CoreModuleWithOptions {
  static readonly module = BackstageCoreModule
  static readonly optionsToken = BACKSTAGE_MODULE_OPTIONS
  static readonly imports = [BackstageArtistModule, BackstageGenreModule]
  static readonly exports = [BackstageArtistModule, BackstageGenreModule]
}
