import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { PlaylistService } from './services'
import { PlaylistEntity, PlaylistTrackEntity } from './entities'
import { PlaylistController } from './controllers'

@Module({
  imports: [TypeOrmModule.forFeature([PlaylistTrackEntity, PlaylistEntity])],
  providers: [PlaylistService],
  controllers: [PlaylistController],
  exports: [PlaylistService],
})
export class PlaylistModule {}
