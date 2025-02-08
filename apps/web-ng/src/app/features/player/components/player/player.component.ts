import { ChangeDetectionStrategy, Component, inject } from '@angular/core'

import { AudioState } from '@core/state'

@Component({
  selector: 'neko-player',
  templateUrl: 'player.component.html',
  styleUrls: ['player.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {
  private readonly audioState = inject(AudioState)

  readonly active = this.audioState.active
}
