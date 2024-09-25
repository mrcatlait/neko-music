import { ChangeDetectionStrategy, Component, Input, computed, inject } from '@angular/core'

import { Queue, Track } from '@core/models'
import { PlaybackState } from '@core/state'
import { generateCompositeTrackId } from '@shared/utils'
import { trackMediaCardSelectors } from 'selectors'

@Component({
  selector: 'neko-track-media-card',
  templateUrl: './track-media-card.component.html',
  styleUrl: './track-media-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackMediaCardComponent {
  private readonly playbackState = inject(PlaybackState)

  @Input({ required: true }) track: Track
  @Input({ required: true }) queue: Queue

  readonly currentTrackId = this.playbackState.currentTrackId

  readonly isCurrentTrack = computed(() => {
    const compositeId = generateCompositeTrackId(this.queue, this.track)
    return this.currentTrackId() === compositeId
  })

  readonly selectors = trackMediaCardSelectors

  handleTogglePlay(): void {
    this.playbackState.togglePlay({ queue: this.queue, trackId: this.track.id })
  }
}
