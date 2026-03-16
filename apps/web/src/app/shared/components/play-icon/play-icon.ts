import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core'

import { PlaybackStore } from '@/core/stores'
import { PlaybackStatus } from '@/shared/enums'

@Component({
  selector: 'n-play-icon',
  template: `<i>{{ icon() }}</i>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayIcon {
  private readonly playbackStore = inject(PlaybackStore)

  readonly trackId = input<string>()

  readonly icon = computed(() => {
    if (this.playbackStore.queueStore.currentTrack()?.id === this.trackId()) {
      return this.playbackStore.status() === PlaybackStatus.Playing ? 'pause' : 'play_arrow'
    }

    return 'play_arrow'
  })
}
