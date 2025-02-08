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
  templateUrl: 'player.component.html',
  styleUrls: ['player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
  private readonly audioState = inject(AudioState)

  readonly active = this.audioState.active
}
