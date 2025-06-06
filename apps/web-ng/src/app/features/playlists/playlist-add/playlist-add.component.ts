import { Component, ChangeDetectionStrategy, inject, computed, OnInit } from '@angular/core'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { toSignal } from '@angular/core/rxjs-interop'
import { debounceTime, distinctUntilChanged } from 'rxjs'

import { PlaylistAddState } from './playlist-add.state'
import { PlaylistCreateComponent } from '../playlist-create'
import { PlaylistAddDialogData } from './models'
import { PlaylistAddRepository } from './playlist-add.repository'
import { CollectionMembershipDto } from './dto'
import { CollectionType } from './enum'

import { injectPortalContext } from '@core/tokens'
import { DialogService } from '@core/services'
import {
  DialogTitleComponent,
  DialogContentComponent,
  TextfieldComponent,
  ErrorComponent,
  ListItemComponent,
} from '@shared/components'
import { ImageUrlPipe } from '@shared/pipes'
@Component({
  standalone: true,
  selector: 'neko-playlist-add',
  templateUrl: 'playlist-add.component.html',
  styleUrl: 'playlist-add.component.scss',
  imports: [
    DialogTitleComponent,
    DialogContentComponent,
    TextfieldComponent,
    ListItemComponent,
    ImageUrlPipe,
    ReactiveFormsModule,
  ],
  providers: [PlaylistAddState, PlaylistAddRepository],
  host: {
    class: 'dialog',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistAddComponent implements OnInit {
  private readonly dialog = inject(DialogService)
  private readonly state = inject(PlaylistAddState)

  readonly context = injectPortalContext<PlaylistAddDialogData>()

  readonly playlists = this.state.playlists
  readonly loading = this.state.loading
  readonly updating = this.state.updating

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
    this.state.fetch({
      collectionId: this.context.data!.collectionId,
      collectionType: this.context.data!.collectionType,
    })
  }

  handleCreatePlaylist() {
    this.dialog.open(PlaylistCreateComponent)
  }

  // isTrackInPlaylist(playlistId: string): boolean {
  //   const playlist = this.playlists()?.find((p) => p.id === playlistId)
  //   return playlist?.tracks.some((t) => t.id === this.data.trackId) ?? false
  // }

  handleAddToPlaylist(playlistId: string) {
    // this.state.addToPlaylist(playlistId, [this.context.data?.collectionId])
  }

  getSupportingText({ membership }: CollectionMembershipDto): string | undefined {
    if (!membership.existing) {
      return
    }

    if (membership.existing === membership.total) {
      if (this.context.data!.collectionType === CollectionType.Track) {
        return 'Track already in playlist'
      }

      return 'Tracks already in playlist'
    }

    return `${membership.existing} tracks already in playlist`
  }
}
