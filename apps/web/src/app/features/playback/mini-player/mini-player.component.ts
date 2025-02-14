import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'

import { Track } from '@core/interfaces'

@Component({
  selector: 'neko-mini-player',
  templateUrl: './mini-player.component.html',
  styleUrls: ['./mini-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniPlayerComponent {
  @Input() track: Track

  @Output() togglePlay = new EventEmitter<void>()
  @Output() skipNext = new EventEmitter<void>()
}
