import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ArtistListComponent } from '@features/artists/artist-list'

@Component({
  standalone: true,
  selector: 'n-artist-list-page',
  imports: [ArtistListComponent],
  template: ` <n-artist-list /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistListPage {}
