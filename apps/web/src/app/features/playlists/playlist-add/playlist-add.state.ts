import { Injectable, computed, inject, signal } from '@angular/core'

import { Playlist } from '@core/models'
import { PlaylistRepository } from '@core/repositories'
import { EntityState } from '@core/state'

@Injectable()
export class PlaylistAddState extends EntityState<Playlist[], void> {
  private readonly repository = inject(PlaylistRepository)
  readonly updating = signal(false)

  readonly playlists = computed(() => this.data() || [])

  addToPlaylist(playlistId: string, trackIds: string[]) {
    this.updating.set(true)
    return this.repository.addTracksToPlaylist(playlistId, { tracks: trackIds }).subscribe({
      next: () => this.updating.set(false),
      error: () => this.updating.set(false),
    })
  }

  protected fetchFn = () => this.repository.getMyPlaylists({ take: 50, offset: 0 })
}
