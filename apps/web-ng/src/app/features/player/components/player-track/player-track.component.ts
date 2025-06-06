import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { playerSelectors } from '@neko/ui-test/selectors'
import { NgFor, NgIf } from '@angular/common'
import { RouterLink } from '@angular/router'

import { PlaybackState } from '@core/state'
import { SelectorDirective } from '@shared/directives'
import { ImageUrlPipe } from '@shared/pipes'

@Component({
  selector: 'neko-player-track',
  templateUrl: 'player-track.component.html',
  styleUrl: 'player-track.component.scss',
  imports: [SelectorDirective, NgIf, RouterLink, ImageUrlPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerTrackComponent {
  private readonly playbackState = inject(PlaybackState)

  readonly selectors = playerSelectors

  readonly currentTrack = this.playbackState.currentTrack
}
