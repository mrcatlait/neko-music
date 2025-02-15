import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output } from '@angular/core'
import { Permission } from '@neko/permissions'
import { NgOptimizedImage } from '@angular/common'
import { trackListItemSelectors } from '@neko/ui-selectors'
import { ButtonDirective, MenuTriggerDirective, SelectorDirective } from '@neko/ui-shared/directives'
import { ImageUrlPipe } from '@neko/ui-shared/pipes'
import { MenuComponent } from '@neko/ui-shared/components'
import { DialogService } from '@neko/ui-shared/services'

import { TrackArtistListComponent } from '../track-artist-list/track-artist-list.component'

import { PlayIconComponent } from '@shared/components'
import { Track } from '@core/interfaces'
import { PlaybackState } from '@features/playback/playback-shared/services'

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

  @Input({ required: true }) track: Track

  private readonly currentTrack = this.playbackState.currentTrack
  readonly isPlaying = computed(() => this.track.id === this.currentTrack()?.id)

  readonly selectors = trackListItemSelectors
  readonly permissions = Permission

  @Output() togglePlay = new EventEmitter<void>()

  handleAddToPlaylist() {
    // this.dialogService.open(PlaylistAddComponent, {
    //   collectionId: this.track.id,
    //   collectionType: CollectionType.Track,
    // } as PlaylistAddDialogData)
  }
}
