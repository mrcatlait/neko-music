import { ChangeDetectionStrategy, Component, computed, EventEmitter, inject, Input, Output } from '@angular/core'

import { LinkedTrack } from '../../models'

import { PlaybackState } from '@core/state'
import { trackListItemSelectors } from 'selectors'

@Component({
  selector: 'neko-track-list-item',
  templateUrl: './track-list-item.component.html',
  styleUrl: './track-list-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackListItemComponent {
  private readonly playbackState = inject(PlaybackState)

  @Input({ required: true }) track: LinkedTrack

  private readonly currentTrackId = this.playbackState.currentTrackId
  readonly isPlaying = computed(() => this.track.linkedTrackId === this.currentTrackId())

  readonly selectors = trackListItemSelectors

  @Output() togglePlay = new EventEmitter<void>()
}
