import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'neko-player',
  templateUrl: 'player.component.html',
  styleUrls: ['player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent {}
