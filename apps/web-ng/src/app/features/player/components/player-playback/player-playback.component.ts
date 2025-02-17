import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { playerSelectors } from '@neko/ui-test/selectors'

import { AudioState } from '@core/state'

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
