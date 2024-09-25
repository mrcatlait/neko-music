import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { PlayerStatus, RepeatOption } from '@core/enum'
import { AudioState, PlaybackState } from '@core/state'
import { playerSelectors } from 'selectors'

@Component({
  selector: 'neko-player-controls',
  templateUrl: 'player-controls.component.html',
  styleUrls: ['player-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerControlsComponent {
  private readonly playbackState = inject(PlaybackState)
  private readonly audioState = inject(AudioState)

  readonly repeatOption = RepeatOption
  readonly playerStatus = PlayerStatus

  readonly selectors = playerSelectors

  readonly status = this.audioState.status
  readonly repeat = this.playbackState.repeat
  readonly shuffle = this.playbackState.shuffle
  readonly hasPrevious = this.playbackState.hasPrevious
  readonly hasNext = this.playbackState.hasNext

  handleTogglePlay() {
    this.audioState.togglePlay()
  }

  handleToggleRepeat() {
    this.playbackState.toggleRepeat()
  }

  handleSkipNext() {
    this.playbackState.next()
  }

  handleSkipPrevious() {
    this.playbackState.previous()
  }

  handleToggleShuffle() {
    this.playbackState.toggleShuffle()
  }
}
