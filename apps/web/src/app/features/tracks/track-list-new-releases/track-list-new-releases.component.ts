import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core'
import { SelectorDirective } from '@neko/ui-shared/directives'
import { trackListNewReleasesSelectors } from '@neko/ui-selectors'
import { rxResource } from '@angular/core/rxjs-interop'

import { TrackListComponent } from '../track-shared/components'
import { mapTrackToLinkedTrack } from '../track-shared/mappers'

import { PlaybackState } from '@core/states'
import { TrackRepository } from '@core/repositories'
import { Queue } from '@core/interfaces'

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

  readonly currentTrackId = this.playbackState.currentTrackId

  readonly tracks = computed(
    () => this.newReleasesResource.value()?.map((track) => mapTrackToLinkedTrack(track, this.basicQueue)) ?? [],
  )

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

  handleTogglePlay(trackId: string) {
    this.playbackState.togglePlay({ queue: this.queue(), trackId })
  }
}
