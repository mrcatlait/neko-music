import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'neko-player-playback',
  templateUrl: 'player-playback.component.html',
  styleUrls: ['player-playback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerPlaybackComponent {}
