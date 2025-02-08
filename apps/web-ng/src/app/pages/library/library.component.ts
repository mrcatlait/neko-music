import { ChangeDetectionStrategy, Component } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'

import { AppBarComponent } from '@shared/components'
import { ChipDirective } from '@shared/directives'

@Component({
  selector: 'neko-library-page',
  standalone: true,
  imports: [AppBarComponent, ChipDirective, ReactiveFormsModule],
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
