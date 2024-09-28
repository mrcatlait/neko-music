import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { playerSelectors } from '@neko/web-test-utils/selectors'

import { PlaybackState } from '@core/state'

@Component({
  selector: 'neko-player-track',
  templateUrl: 'player-track.component.html',
  styleUrl: 'player-track.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerTrackComponent {
  private readonly playbackState = inject(PlaybackState)

  readonly selectors = playerSelectors

  readonly currentTrack = this.playbackState.currentTrack
}
