import { Injectable, computed, inject } from '@angular/core'
import { map } from 'rxjs'
import { TrackRepository } from '@core/repositories'

import { EntityState } from '@core/states'
import { Queue } from '@core/interfaces'
import { LinkedTrack } from '@features/tracks/track-shared/interfaces'
import { mapTrackToLinkedTrack } from '@features/tracks/track-shared/mappers'

@Injectable()
export class TrackListNewReleasesState extends EntityState<LinkedTrack[], void> {
  private readonly repository = inject(TrackRepository)

  private readonly basicQueue: Queue = {
    tracks: [],
    source: { entityId: 'track-new-releases', name: 'New Releases' },
  }

  readonly tracks = computed(() => this.data() || [])
  readonly queue = computed<Queue>(() => {
    const tracks = this.tracks()

    return {
      ...this.basicQueue,
      tracks,
    }
  })

  protected fetchFn = () =>
    this.repository.getNew().pipe(map((tracks) => tracks.map((track) => mapTrackToLinkedTrack(track, this.basicQueue))))
}
