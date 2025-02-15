import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { SelectorDirective } from '@neko/ui-shared/directives'
import { trackListNewReleasesSelectors } from '@neko/ui-selectors'
import { rxResource } from '@angular/core/rxjs-interop'

import { TrackListComponent } from '../track-shared/components'

import { TrackRepository } from '@core/repositories'
import { Queue, Track } from '@core/interfaces'
import { PlaybackState } from '@features/playback/playback-shared/services'

@Component({
  standalone: true,
  selector: 'neko-track-list-new-releases',
  templateUrl: './track-list-new-releases.component.html',
  imports: [TrackListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackListNewReleasesComponent extends SelectorDirective {
  private readonly repository = inject(TrackRepository)
  private readonly playbackState = inject(PlaybackState)

  readonly newReleasesResource = rxResource({
    loader: () => this.repository.getNew(),
  })

  readonly currentTrack = this.playbackState.currentTrack

  readonly tracks = computed(() => this.newReleasesResource.value() ?? [])

  private readonly basicQueue: Queue = {
    tracks: [],
    source: { entityId: 'track-new-releases', name: 'New Releases' },
  }

  readonly queue = computed<Queue>(() => {
    const tracks = this.tracks()

    return {
      ...this.basicQueue,
      tracks,
    }
  })

  readonly selectors = trackListNewReleasesSelectors

  override selector = this.selectors.trackContainer

  handleTogglePlay(track: Track) {
    this.playbackState.togglePlay(track)
  }
}
