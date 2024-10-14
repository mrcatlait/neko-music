import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

import { TrackNewReleasesModule } from '@features/tracks/track-new-releases'
import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-artist-details',
  imports: [SharedModule, TrackNewReleasesModule],
  templateUrl: 'artist-details.component.html',
  styleUrl: 'artist-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistDetailsPage {
  @Input() id: string
}
