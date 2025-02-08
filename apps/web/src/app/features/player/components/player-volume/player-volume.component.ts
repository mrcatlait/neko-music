import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { playerSelectors } from '@neko/ui-selectors'
import { ButtonDirective, SelectorDirective, SliderDirective } from '@neko/ui-shared/directives'

import { AudioState } from '@core/states'

@Component({
  selector: 'neko-player-volume',
  imports: [ButtonDirective, SelectorDirective, SliderDirective],
  templateUrl: 'player-volume.component.html',
  styleUrls: ['player-volume.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerVolumeComponent {
  private readonly audioState = inject(AudioState)

  readonly icon = computed(() => (this.audioState.muted() ? 'volume_off' : 'volume_up'))
  readonly volume = computed(() => (this.audioState.muted() ? 0 : this.audioState.volume()))

  readonly selectors = playerSelectors

  changeVolume(event: Event) {
    const volume = Number((event.target as HTMLInputElement).value)

    this.audioState.setVolume({ volume })
  }

  toggleMute() {
    this.audioState.toggleMute()
  }
}
