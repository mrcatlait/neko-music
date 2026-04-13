import { Module } from '@nestjs/common'

import { BACKSTAGE_MODULE_OPTIONS } from './tokens'
import { BackstageArtistModule } from './artist/artist.module'
import { BackstageGenreModule } from './genre/genre.module'
import { BackstageAlbumModule } from './album/album.module'
import { BackstageTrackModule } from './track/track.module'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class BackstageCoreModule extends CoreModuleWithOptions {
  static readonly module = BackstageCoreModule
  static readonly optionsToken = BACKSTAGE_MODULE_OPTIONS
  static readonly imports = [BackstageAlbumModule, BackstageArtistModule, BackstageGenreModule, BackstageTrackModule]
  static readonly exports = [BackstageAlbumModule, BackstageArtistModule, BackstageGenreModule, BackstageTrackModule]
}
