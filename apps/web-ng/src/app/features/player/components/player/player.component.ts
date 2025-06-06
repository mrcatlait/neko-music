import { NgIf } from '@angular/common'
import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { PlayerControlsComponent, PlayerPlaybackComponent, PlayerTrackComponent, PlayerVolumeComponent } from '..'

import { AudioState } from '@core/state'
import { SelectorDirective } from '@shared/directives'

@Component({
  selector: 'neko-player',
  templateUrl: 'player.component.html',
  styleUrls: ['player.component.scss'],
  imports: [PlayerTrackComponent, PlayerControlsComponent, PlayerVolumeComponent, PlayerPlaybackComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
  private readonly audioState = inject(AudioState)

  readonly active = this.audioState.active
}
