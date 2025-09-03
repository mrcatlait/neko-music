import { ChangeDetectionStrategy, Component, input } from '@angular/core'

import { Track } from '@/shared/entities'
import { ArtistList } from '@/shared/components'

@Component({
  selector: 'n-track-info',
  imports: [ArtistList],
  templateUrl: './track-info.html',
  styleUrl: './track-info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackInfo {
  readonly track = input.required<Track>()
}
