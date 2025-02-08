import { Injectable, computed, inject, signal } from '@angular/core'

import { PlaylistAddRepository } from './playlist-add.repository'
import { CollectionType } from './enum'
import { CollectionMembershipDto } from './dto'

import { EntityState } from '@core/state'
import { PlaylistRepository } from '@core/repositories'

interface FetchPayload {
  collectionId: string
  collectionType: CollectionType
}

@Injectable()
export class PlaylistAddState extends EntityState<CollectionMembershipDto[], FetchPayload> {
  private readonly playlistAddRepository = inject(PlaylistAddRepository)
  readonly playlistRepository = inject(PlaylistRepository)

  readonly updating = signal(false)

  readonly playlists = computed(() => this.data() || [])

  addToPlaylist(playlistId: string, trackIds: string[]) {
    this.updating.set(true)
    return this.playlistRepository.addTracksToPlaylist(playlistId, { tracks: trackIds }).subscribe({
      next: () => this.updating.set(false),
      error: () => this.updating.set(false),
    })
  }

  protected fetchFn = (payload: FetchPayload) =>
    this.playlistAddRepository.getCollectionMembership(payload.collectionId, payload.collectionType, {
      take: 50,
      offset: 0,
    })
}
