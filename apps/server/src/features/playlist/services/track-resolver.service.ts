import { PlaylistTrackRepository } from '../repositories'

import { CollectionType } from '@common/enums'
import { QueueTrack, Track } from '@features/track/models'
import { TrackRepository } from '@features/track/repositories'

export class TrackResolverService {
  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly playlistTrackRepository: PlaylistTrackRepository,
  ) {}

  async resolveTrackIds(itemId: string, itemType: CollectionType): Promise<string[]> {
    switch (itemType) {
      case CollectionType.ALBUM:
        return this.trackRepository.getAlbumTrackIds(itemId)
      case CollectionType.PLAYLIST:
        return this.playlistTrackRepository.getItemIdsFull(itemId)
      case CollectionType.TRACK:
        return [itemId]
      default:
        return []
    }
  }

  resolveTracks(trackIds: string[]): Promise<Track[]> {
    return this.trackRepository.getItems(trackIds)
  }

  resolveQueueTracks(trackIds: string[]): Promise<QueueTrack[]> {
    return this.trackRepository.getQueueItems(trackIds)
  }
}
