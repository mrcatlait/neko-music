import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { PlaybackStore, QueueStore } from '@/core/stores'
import { PlaybackStatus, RepeatMode } from '@/shared/enums'
import { IconButton, PlayIcon } from '@/shared/components'

@Component({
  selector: 'n-player-controls',
  imports: [IconButton, PlayIcon],
  templateUrl: './player-controls.html',
  styleUrl: './player-controls.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerControls {
  protected readonly queue = inject(QueueStore)
  protected readonly playbackStore = inject(PlaybackStore)

  protected readonly repeatMode = RepeatMode

  togglePlay(): void {
    if (this.playbackStore.status() === PlaybackStatus.Playing) {
      this.playbackStore.pause()
    } else {
      this.playbackStore.play()
    }
  }
}
