import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'neko-player-controls',
  templateUrl: 'player-controls.component.html',
  styleUrls: ['player-controls.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerControlsComponent {
  handleTogglePlay() {
    // this.audioState.togglePlay()
  }

  handleToggleRepeat() {
    // this.playbackState.toggleRepeat()
  }

  handleSkipNext() {
    // this.playbackState.next()
  }

  handleSkipPrevious() {
    // this.playbackState.previous()
  }

  handleToggleShuffle() {
    // this.playbackState.toggleShuffle()
  }
}
