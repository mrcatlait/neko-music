import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { trackNewReleasesSelectors } from '@selectors'

import { TrackNewReleaseState } from '../../state'

import { ArtistRole } from '@core/enum'
import { PlaybackState } from '@core/state'
import { generateCompositeTrackId } from '@shared/utils'
import { Track } from '@core/models'

@Component({
  selector: 'neko-track-new-releases',
  templateUrl: './track-new-releases.component.html',
  styleUrl: './track-new-releases.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackNewReleasesComponent implements OnInit {
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
