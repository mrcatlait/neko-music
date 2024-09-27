import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core'

import { TrackArtist } from '@core/models'

@Component({
  selector: 'neko-track-artist-list',
  templateUrl: './track-artist-list.component.html',
  styleUrl: './track-artist-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackArtistListComponent {
  @Input({ required: true }) artists: TrackArtist[]

  @HostBinding('attr.title')
  get title() {
    return this.artists.map((artist) => artist.name).join(', ')
  }
}
