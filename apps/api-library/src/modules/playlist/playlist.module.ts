import { Module } from '@nestjs/common'

import { PlaylistRepository } from './repositories/playlist.repository'
import { PlaylistTrackRepository } from './repositories/playlist-track.repository'
import { PlaylistController } from './controllers'
import {
  GetCollectionMembershipHandler,
  GetPlaylistHandler,
  GetPlaylistTracksHandler,
  GetUserPlaylistsHandler,
} from './queries'
import { CreatePlaylistHandler, DeletePlaylistHandler, AddToPlaylistHandler, UpdatePlaylistHandler } from './commands'
import { TrackResolverService } from './services'

@Module({
  controllers: [PlaylistController],
  providers: [
    PlaylistRepository,
    PlaylistTrackRepository,
    TrackResolverService,
    GetCollectionMembershipHandler,
    AddToPlaylistHandler,
    CreatePlaylistHandler,
    DeletePlaylistHandler,
    GetUserPlaylistsHandler,
    GetPlaylistHandler,
    UpdatePlaylistHandler,
    GetPlaylistTracksHandler,
  ],
  exports: [PlaylistRepository, PlaylistTrackRepository],
})
export class PlaylistModule {}
