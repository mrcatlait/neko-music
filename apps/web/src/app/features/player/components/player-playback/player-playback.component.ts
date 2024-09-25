import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { AudioState } from '@core/state'
import { playerSelectors } from 'selectors'

@Component({
  selector: 'neko-player-playback',
  templateUrl: 'player-playback.component.html',
  styleUrls: ['player-playback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerPlaybackComponent {
  private readonly audioState = inject(AudioState)

  readonly currentTime = this.audioState.currentTime
  readonly duration = this.audioState.duration

  readonly selectors = playerSelectors

  seek(event: Event) {
    const time = Number((event.target as HTMLInputElement).value)

    this.audioState.seek({ time })
  }

  pause() {
    this.audioState.pause()
  }

  play() {
    this.audioState.play()
  }
}
