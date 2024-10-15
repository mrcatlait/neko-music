import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TrackService } from './track.service'
import { TrackController } from './track.controller'
import { GenreEntity, TrackArtistEntity, TrackEntity, TrackImageEntity } from './entities'

import { ArtistModule } from '@modules/artist'

@Module({
  imports: [
    forwardRef(() => ArtistModule),
    TypeOrmModule.forFeature([GenreEntity, TrackArtistEntity, TrackImageEntity, TrackEntity]),
  ],
  providers: [TrackService],
  controllers: [TrackController],
  exports: [TrackService],
})
export class TrackModule {}
