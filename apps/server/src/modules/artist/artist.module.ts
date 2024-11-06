import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ArtistsController } from './controllers'
import { ArtistEntity, ArtistImageEntity } from './entities'
import { ArtistService } from './services'

import { TrackModule } from '@modules/track'

@Module({
  imports: [forwardRef(() => TrackModule), TypeOrmModule.forFeature([ArtistImageEntity, ArtistEntity])],
  providers: [ArtistService],
  controllers: [ArtistsController],
  exports: [ArtistService],
})
export class ArtistModule {}
