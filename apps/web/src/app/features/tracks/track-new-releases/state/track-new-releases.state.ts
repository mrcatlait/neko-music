import { Injectable, computed, inject } from '@angular/core'
import { map } from 'rxjs'

import { Queue } from '@core/models'
import { TrackRepository } from '@core/repositories'
import { EntityState } from '@core/state'
import { mapTrackToLinkedTrack } from '@features/tracks/track-shared/mappers'
import { LinkedTrack } from '@features/tracks/track-shared/models'

@Injectable()
export class TrackNewReleaseState extends EntityState<LinkedTrack[], void> {
  private readonly repository = inject(TrackRepository)

  protected override cache = true

  private readonly basicQueue: Queue = {
    tracks: [],
    source: { entityId: 'track-new-releases', name: 'New releases' },
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
