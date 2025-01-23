import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core'
import { trackListNewReleasesSelectors } from '@neko/ui-test/selectors'

import { TrackSharedModule } from '../track-shared'
import { TrackListNewReleasesState } from './track-list-new-releases.state'

import { PlaybackState } from '@core/state'
import { SharedModule } from '@shared/shared.module'
import { SelectorDirective } from '@shared/directives'

@Component({
  standalone: true,
  selector: 'neko-track-list-new-releases',
  templateUrl: './track-list-new-releases.component.html',
  imports: [SharedModule, TrackSharedModule],
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
