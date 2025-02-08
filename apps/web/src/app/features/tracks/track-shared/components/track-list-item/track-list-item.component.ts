import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output } from '@angular/core'
import { Permission } from '@neko/permissions'
import { NgOptimizedImage } from '@angular/common'
import { trackListItemSelectors } from '@neko/ui-selectors'
import { PlaylistAddComponent } from '@features/playlists/playlist-add'
import { PlaylistAddDialogData } from '@features/playlists/playlist-add/models'
import { CollectionType } from '@features/playlists/playlist-add/enum'
import { ButtonDirective, SelectorDirective } from '@neko/ui-shared/directives'
import { ImageUrlPipe } from '@neko/ui-shared/pipes'

import { TrackArtistListComponent } from '../track-artist-list/track-artist-list.component'
import { LinkedTrack } from '../../interfaces'

import { PlaybackState } from '@core/states'
import { MenuComponent, PlayIconComponent } from '@shared/components'
import { DialogService } from '@core/services'

@Component({
  selector: 'neko-track-list-item',
  templateUrl: './track-list-item.component.html',
  styleUrl: './track-list-item.component.scss',
  imports: [
    NgOptimizedImage,
    ButtonDirective,
    PlayIconComponent,
    SelectorDirective,
    TrackArtistListComponent,
    MenuTriggerDirective,
    MenuComponent,
    ImageUrlPipe,
  ],
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
