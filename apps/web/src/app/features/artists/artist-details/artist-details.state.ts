import { Injectable, computed, inject } from '@angular/core'

import { Artist } from '@core/models'
import { ArtistRepository } from '@core/repositories'
import { EntityState } from '@core/state'

interface ArtistDetailsStatePayload {
  artistId: string
}
@Injectable()
export class ArtistDetailsState extends EntityState<Artist, ArtistDetailsStatePayload> {
  private readonly repository = inject(ArtistRepository)

  readonly artist = computed(() => this.data())

  protected fetchFn = (payload: ArtistDetailsStatePayload) => this.repository.getById(payload.artistId)
}
