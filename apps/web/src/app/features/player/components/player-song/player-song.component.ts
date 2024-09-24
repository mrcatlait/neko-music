import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'neko-player-song',
  templateUrl: 'player-song.component.html',
  styleUrls: ['player-song.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerSongComponent {}
