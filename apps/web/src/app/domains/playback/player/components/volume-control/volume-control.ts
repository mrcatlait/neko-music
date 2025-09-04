import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'

import { PlaybackStore } from '@/core/stores'
import { IconButton, Slider } from '@/shared/components'

@Component({
  selector: 'n-volume-control',
  imports: [IconButton, Slider],
  templateUrl: './volume-control.html',
  styleUrl: './volume-control.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VolumeControl {
  private readonly playbackStore = inject(PlaybackStore)

  protected readonly volume = computed(() => (this.playbackStore.muted() ? 0 : this.playbackStore.volume()))
  protected readonly muted = computed(() => this.playbackStore.muted())

  toggleMute(): void {
    this.playbackStore.toggleMute()
  }

  changeVolume(event: Event) {
    const volume = Number((event.target as HTMLInputElement).value)
    this.playbackStore.setVolume(volume)
  }
}
