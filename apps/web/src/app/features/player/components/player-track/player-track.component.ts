import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { playerSelectors } from '@neko/ui-selectors'
import { SelectorDirective } from '@neko/ui-shared/directives'
import { ImageUrlPipe } from '@neko/ui-shared/pipes'

import { PlaybackState } from '@core/states'

@Component({
  selector: 'neko-player-track',
  imports: [SelectorDirective, RouterLink, ImageUrlPipe],
  templateUrl: 'player-track.component.html',
  styleUrl: 'player-track.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerTrackComponent {
  private readonly playbackState = inject(PlaybackState)

  readonly selectors = playerSelectors

  readonly currentTrack = this.playbackState.currentTrack
}
