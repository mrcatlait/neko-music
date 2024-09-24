import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PlaylistService } from './playlist.service'
import { PlaylistEntity, PlaylistTrackEntity } from './entities'
import { PlaylistController } from './playlist.controller'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([PlaylistTrackEntity, PlaylistEntity])],
  providers: [PlaylistService],
  controllers: [PlaylistController],
  exports: [PlaylistService],
})
export class PlaylistModule {}
