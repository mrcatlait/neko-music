import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output } from '@angular/core'
import { trackListItemSelectors } from '@selectors'
import { Permission } from '@neko/permissions'

import { LinkedTrack } from '../../models'

import { PlaybackState } from '@core/state'
import { PlaylistAddComponent } from '@features/playlists/playlist-add'
import { DialogService } from '@core/services'

@Component({
  selector: 'neko-track-list-item',
  templateUrl: './track-list-item.component.html',
  styleUrl: './track-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackListItemComponent {
  private readonly dialogService = inject(DialogService)
  private readonly playbackState = inject(PlaybackState)

  @Input({ required: true }) track: LinkedTrack

  private readonly currentTrackId = this.playbackState.currentTrackId
  readonly isPlaying = computed(() => this.track.linkedTrackId === this.currentTrackId())

  readonly selectors = trackListItemSelectors
  readonly permissions = Permission

  menuOpen = false

  @Output() togglePlay = new EventEmitter<void>()

  handleAddToPlaylist() {
    this.dialogService.open(PlaylistAddComponent, {
      trackId: this.track.id,
    })
  }

  handleMenuClick(): void {
    this.menuOpen = false
  }
}
