import { Injectable, computed, inject } from '@angular/core'
import { map } from 'rxjs'

import { Queue } from '@core/models'
import { ArtistRepository } from '@core/repositories'
import { EntityState } from '@core/state'
import { mapTrackToLinkedTrack } from '@features/tracks/track-shared/mappers'
import { LinkedTrack } from '@features/tracks/track-shared/models'

interface TrackListByArtistPayload {
  artistId: string
}

@Injectable()
export class TrackListByArtistState extends EntityState<LinkedTrack[], TrackListByArtistPayload> {
  private readonly repository = inject(ArtistRepository)

  private readonly basicQueue: Queue = {
    tracks: [],
    source: { entityId: '', name: 'Songs' },
  }

  readonly tracks = computed(() => this.data() || [])
  readonly queue = computed<Queue>(() => {
    const tracks = this.tracks()

    return {
      ...this.basicQueue,
      tracks,
    }
  })

  protected fetchFn = (payload: TrackListByArtistPayload) => {
    this.basicQueue.source.entityId = payload.artistId

    return this.repository
      .getTracksById(payload.artistId, { take: 12, offset: 0 })
      .pipe(map((tracks) => tracks.map((track) => mapTrackToLinkedTrack(track, this.basicQueue))))
  }
}
