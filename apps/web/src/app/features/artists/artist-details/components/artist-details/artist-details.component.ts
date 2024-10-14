import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { trackNewReleasesSelectors } from '@selectors'

import { ArtistDetailsState } from '../../state'

import { ArtistRole } from '@core/enum'
import { PlaybackState } from '@core/state'
import { generateCompositeTrackId } from '@shared/utils'
import { Track } from '@core/models'

@Component({
  selector: 'neko-artist-details',
  templateUrl: './artist-details.component.html',
  styleUrl: './artist-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistDetailsComponent implements OnInit {
  private readonly trackNewReleasesState = inject(TrackNewReleaseState)
  private readonly playbackState = inject(PlaybackState)

  readonly tracks = this.trackNewReleasesState.data
  readonly loading = this.trackNewReleasesState.loading

  readonly currentTrackId = this.playbackState.currentTrackId

  private readonly queue = this.trackNewReleasesState.queue

  readonly artistRole = ArtistRole

  readonly selectors = trackNewReleasesSelectors

  ngOnInit() {
    this.trackNewReleasesState.fetch()
  }

  handleTogglePlay(trackId: string) {
    this.playbackState.togglePlay({ queue: this.queue(), trackId })
  }

  isPlaying(track: Track) {
    return generateCompositeTrackId(this.queue(), track) === this.currentTrackId()
  }
}
