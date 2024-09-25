import { Injectable, computed, inject } from '@angular/core'

import { Queue, Track } from '@core/models'
import { TrackRepository } from '@core/repositories'
import { EntityState } from '@core/state'

@Injectable()
export class TrackNewReleaseState extends EntityState<Track[], void> {
  private readonly repository = inject(TrackRepository)

  readonly tracks = computed(() => this.data() || [])
  readonly queue = computed<Queue>(() => {
    const tracks = this.tracks()

    return {
      tracks,
      source: { entityId: 'new-release', name: 'New releases' },
    }
  })

  protected fetchFn = () => this.repository.getNew()
}
