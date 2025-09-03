import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { PlaybackStore, QueueStore } from '@/core/stores'
import { PLAYBACK_STATUS, REPEAT_MODE } from '@/shared/enums'
import { Button } from '@/shared/directives'
import { PlayIcon } from '@/shared/components'

@Component({
  selector: 'n-player-controls',
  imports: [Button, PlayIcon],
  templateUrl: './player-controls.html',
  styleUrl: './player-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerControls {
  protected readonly queue = inject(QueueStore)
  protected readonly playbackStore = inject(PlaybackStore)

  protected readonly repeatMode = REPEAT_MODE

  togglePlay(): void {
    if (this.playbackStore.status() === PLAYBACK_STATUS.Playing) {
      this.playbackStore.pause()
    } else {
      this.playbackStore.play()
    }
  }
}
