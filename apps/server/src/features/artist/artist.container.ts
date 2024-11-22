import { ArtistRepository } from './repositories'
import { ArtistQueryService } from './services'

import { TrackContainer } from '@features/track'
import { BaseContainer } from '@core/base'

export class ArtistContainer extends BaseContainer {
  static getArtistQueryService(): ArtistQueryService {
    return this.getInstance(
      ArtistQueryService,
      () => new ArtistQueryService(this.getArtistRepository(), TrackContainer.getTrackQueryService()),
    )
  }

  static getArtistRepository(): ArtistRepository {
    return this.getInstance(ArtistRepository, () => new ArtistRepository())
  }
}
