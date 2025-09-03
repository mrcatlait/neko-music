import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'

import { Slider } from '@/shared/directives'
import { PlaybackStore } from '@/core/stores'

@Component({
  selector: 'n-progress-control',
  imports: [Slider],
  template: `<input
    aria-label="Playback"
    class="slider"
    min="0"
    nSlider
    type="range"
    [max]="duration()"
    [value]="currentTime()"
    (input)="seek($event)"
  />`,
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: 16px;

      &:not(:hover) input {
        &:not(:hover)::-webkit-slider-thumb {
          background-color: transparent;
        }

        &:not(:hover)::-moz-range-thumb {
          background-color: transparent;
        }
      }
    }

    .slider {
      --n-slider-track-height: 6px;
      --n-slider-thumb-diameters: 14px;
      --n-slider-track-hitbox: 24px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressControl {
  private readonly playbackStore = inject(PlaybackStore)

  protected readonly duration = computed(() => this.playbackStore.currentDuration())
  protected readonly currentTime = computed(() => this.playbackStore.currentTime())

  seek(event: Event) {
    const time = Number((event.target as HTMLInputElement).value)
    this.playbackStore.seek(time)
  }
}
