import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'

import { PlayerStatus } from '@core/enum'
import { AudioState } from '@core/state'

@Component({
  selector: 'neko-play-icon',
  templateUrl: './play-icon.component.html',
  styleUrl: './play-icon.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayIconComponent {
  private readonly audioState = inject(AudioState)

  readonly isPlaying = input.required<boolean>()

  readonly icon = computed(() => {
    if (!this.isPlaying()) {
      return 'play_arrow'
    }

    switch (this.audioState.status()) {
      case PlayerStatus.Playing:
        return 'pause'
      case PlayerStatus.Loading:
        return 'downloading'
      case PlayerStatus.Paused:
      default:
        return 'play_arrow'
    }
  })
}
