import { Component, ChangeDetectionStrategy, inject, computed, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'
import { toSignal } from '@angular/core/rxjs-interop'
import { debounceTime, distinctUntilChanged } from 'rxjs'

import { PlaylistAddState } from './playlist-add.state'
import { PlaylistCreateComponent } from '../playlist-create'

import { PORTAL_CONTEXT } from '@core/tokens'
import { SharedModule } from '@shared/shared.module'
import { DialogService } from '@core/services'

@Component({
  standalone: true,
  selector: 'neko-playlist-add',
  templateUrl: 'playlist-add.component.html',
  styleUrl: 'playlist-add.component.scss',
  imports: [SharedModule],
  providers: [PlaylistAddState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistAddComponent implements OnInit {
  private readonly dialog = inject(DialogService)
  private readonly state = inject(PlaylistAddState)

  readonly context = inject(PORTAL_CONTEXT)

  readonly playlists = this.state.playlists
  readonly loading = this.state.loading

  readonly searchControl = new FormControl('')
  private readonly searchInput = toSignal(
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()),
  )

  readonly hasPlaylists = computed(() => this.playlists().length > 0)

  readonly filteredPlaylists = computed(() => {
    const input = this.searchInput()?.toLowerCase() || ''
    const playlists = this.playlists()

    if (!playlists || !input) return playlists

    return playlists.filter((p) => p.name.toLowerCase().includes(input))
  })

  ngOnInit() {
    this.state.fetch()
  }

  handleCreatePlaylist() {
    this.dialog.open(PlaylistCreateComponent)
  }

  // isTrackInPlaylist(playlistId: string): boolean {
  //   const playlist = this.playlists()?.find((p) => p.id === playlistId)
  //   return playlist?.tracks.some((t) => t.id === this.data.trackId) ?? false
  // }
}
