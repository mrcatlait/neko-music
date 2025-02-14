import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import {
  PlayerControlsComponent,
  PlayerPlaybackComponent,
  PlayerTrackComponent,
  PlayerVolumeComponent,
} from './components'

import { AudioState } from '@core/states'

@Component({
  selector: 'neko-player',
  imports: [PlayerControlsComponent, PlayerPlaybackComponent, PlayerTrackComponent, PlayerVolumeComponent],
  template: `
    @if (!active()) {
      <div class="player-container">
        <neko-player-track />

        <neko-player-controls />

        <neko-player-volume />
      </div>

      <neko-player-playback />
    }
  `,
  styleUrls: ['player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
  private readonly audioState = inject(AudioState)

  readonly active = this.audioState.active
}
