import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output } from '@angular/core'
import { trackListItemSelectors } from '@selectors'
import { Permission } from '@neko/permissions'

import { LinkedTrack } from '../../models'

import { PlaybackState } from '@core/state'
import { PlaylistAddComponent } from '@features/playlists/playlist-add'
import { DialogService } from '@core/services'
import { PlaylistAddDialogData } from '@features/playlists/playlist-add/models'
import { CollectionType } from '@features/playlists/playlist-add/enum'

@Component({
  selector: 'neko-track-list-item',
  templateUrl: 'track-list-item.component.html',
  styleUrl: 'track-list-item.component.scss',
  standalone: false,
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

  @Output() togglePlay = new EventEmitter<void>()

  handleAddToPlaylist() {
    this.dialogService.open(PlaylistAddComponent, {
      collectionId: this.track.id,
      collectionType: CollectionType.Track,
    } as PlaylistAddDialogData)
  }
}
