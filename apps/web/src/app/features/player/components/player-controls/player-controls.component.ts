import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { playerSelectors } from '@neko/ui-selectors'
import { ButtonDirective, SelectorDirective } from '@neko/ui-shared/directives'

import { AudioState, PlaybackState } from '@core/states'
import { PlayerStatus, RepeatOption } from '@core/enums'
import { PlayIconComponent } from '@shared/components'

@Component({
  selector: 'neko-player-controls',
  imports: [ButtonDirective, SelectorDirective, PlayIconComponent],
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
