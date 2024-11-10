import { Injectable, computed, inject } from '@angular/core'

import { Playlist } from '@core/models'
import { PlaylistRepository } from '@core/repositories'
import { EntityState } from '@core/state'

@Injectable()
export class PlaylistAddState extends EntityState<Playlist[], void> {
  private readonly repository = inject(PlaylistRepository)

  readonly playlists = computed(() => this.data() || [])

  addToPlaylist(playlistId: string, trackIds: string[]) {
    return this.repository.addTracksToPlaylist(playlistId, { tracks: trackIds })
  }

  protected fetchFn = () => this.repository.getMyPlaylists({ take: 50, offset: 0 })
}
