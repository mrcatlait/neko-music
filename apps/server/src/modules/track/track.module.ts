import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TrackService, TrackStreamingService } from './services'
import { TrackController } from './controllers'
import { GenreEntity, TrackArtistEntity, TrackEntity, TrackGenreEntity, TrackImageEntity } from './entities'

import { ArtistModule } from '@modules/artist'

@Module({
  imports: [
    forwardRef(() => ArtistModule),
    TypeOrmModule.forFeature([GenreEntity, TrackArtistEntity, TrackGenreEntity, TrackImageEntity, TrackEntity]),
  ],
  providers: [TrackService, TrackStreamingService],
  controllers: [TrackController],
  exports: [TrackService],
})
export class TrackModule {}
