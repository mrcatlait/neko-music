import { Injectable } from '@nestjs/common'

import { PlaylistTrackRepository } from '../repositories'

import { CollectionType } from '@modules/shared/enums'
import { TrackRepository } from '@modules/track/repositories'

@Injectable()
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
}
