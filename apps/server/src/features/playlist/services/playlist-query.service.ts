import { Playlist, PlaylistMembership } from '../models'
import {
  GetCollectionMembershipQuery,
  GetPlaylistQueueQuery,
  GetPlaylistTracksQuery,
  GetUserPlaylistsQuery,
} from '../queries'
import { PlaylistRepository, PlaylistTrackRepository } from '../repositories'
import { TrackResolverService } from './track-resolver.service'

import { Track, QueueTrack } from '@features/track/models'
import { Pagination } from '@core/models'

export class PlaylistQueryService {
  constructor(
    private readonly playlistRepository: PlaylistRepository,
    private readonly playlistTrackRepository: PlaylistTrackRepository,
    private readonly trackResolverService: TrackResolverService,
  ) {}

  async getCollectionMembership(query: GetCollectionMembershipQuery): Promise<Pagination<PlaylistMembership>> {
    const [trackIds, playlistsResult] = await Promise.all([
      this.trackResolverService.resolveTrackIds(query.itemId, query.itemType),
      this.playlistRepository.getItemsWithTrackIds(query.userId, query.pageOptionsDto),
    ])

    return {
      data: playlistsResult.data.map((playlist) => ({
        id: playlist.id,
        name: playlist.name,
        membership: {
          total: trackIds.length,
          existing: trackIds.filter((trackId) => playlist.tracks?.includes(trackId)).length,
        },
      })),
      hasMore: playlistsResult.hasMore,
    }
  }

  getUserPlaylists(query: GetUserPlaylistsQuery): Promise<Pagination<Playlist>> {
    return this.playlistRepository.getItems(query.userId, query.pageOptionsDto)
  }

  async getPlaylistTracks(query: GetPlaylistTracksQuery): Promise<Track[]> {
    // @todo verify that playlist if public or user is member
    const trackIds = await this.playlistTrackRepository.getItemIds(query.playlistId, query.pageOptionsDto)
    return this.trackResolverService.resolveTracks(trackIds)
  }

  async getPlaylistQueueTracks(query: GetPlaylistQueueQuery): Promise<QueueTrack[]> {
    // @todo verify that playlist if public or user is member
    const trackIds = await this.playlistTrackRepository.getItemIdsFull(query.playlistId)
    return this.trackResolverService.resolveQueueTracks(trackIds)
  }
}
