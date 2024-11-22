import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'

import { SharedModule } from '@shared/shared.module'

@Component({
  selector: 'neko-library-page',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './library.component.html',
  styleUrl: 'library.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LibraryPage {
  readonly filters = new FormGroup({
    playlists: new FormControl(false),
    albums: new FormControl(false),
    artists: new FormControl(false),
    songs: new FormControl(false),
  })
}
