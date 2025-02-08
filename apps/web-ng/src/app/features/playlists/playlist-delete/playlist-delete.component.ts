import { ChangeDetectionStrategy, Component } from '@angular/core'

import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-playlist-delete',
  templateUrl: 'playlist-delete.component.html',
  imports: [SharedModule],
  host: {
    class: 'dialog',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaylistDeleteComponent {
  handleSubmit() {}
}
