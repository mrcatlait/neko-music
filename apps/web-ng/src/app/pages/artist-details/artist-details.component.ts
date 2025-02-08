import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

import { ArtistDetailsComponent } from '@features/artists/artist-details'
import { TrackListByArtistComponent } from '@features/tracks/track-list-by-artist'

@Component({
  standalone: true,
  selector: 'neko-artist-details-page',
  imports: [ArtistDetailsComponent, TrackListByArtistComponent],
  templateUrl: 'artist-details.component.html',
  styleUrl: 'artist-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistDetailsPage {
  @Input() id: string
}
