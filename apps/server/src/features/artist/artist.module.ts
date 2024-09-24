import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ArtistService } from './artist.service'
import { ArtistsController } from './artist.controller'
import { ArtistEntity, ArtistImageEntity, ArtistLinkEntity } from './entities'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ArtistImageEntity, ArtistLinkEntity, ArtistEntity])],
  providers: [ArtistService],
  controllers: [ArtistsController],
  exports: [ArtistService],
})
export class ArtistModule {}
