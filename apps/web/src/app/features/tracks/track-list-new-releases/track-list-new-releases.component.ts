import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { SelectorDirective } from '@neko/ui-shared/directives'
import { trackListNewReleasesSelectors } from '@neko/ui-selectors'

import { TrackListNewReleasesState } from './track-list-new-releases.state'
import { TrackListComponent } from '../track-shared/components'

import { PlaybackState } from '@core/states'

@Component({
  standalone: true,
  selector: 'neko-track-list-new-releases',
  templateUrl: './track-list-new-releases.component.html',
  imports: [TrackListComponent],
  providers: [TrackListNewReleasesState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackListNewReleasesComponent extends SelectorDirective implements OnInit {
  private readonly state = inject(TrackListNewReleasesState)
  private readonly playbackState = inject(PlaybackState)

  readonly tracks = this.state.tracks
  readonly loading = this.state.loading

  readonly currentTrackId = this.playbackState.currentTrackId

  readonly queue = this.state.queue

  readonly selectors = trackListNewReleasesSelectors

  override selector = this.selectors.trackContainer

  ngOnInit() {
    this.state.fetch()
  }

  handleTogglePlay(trackId: string) {
    this.playbackState.togglePlay({ queue: this.queue(), trackId })
  }
}
