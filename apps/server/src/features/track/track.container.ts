import { TrackArtistRepository, TrackRepository } from './repositories'
import { TrackQueryService, TrackStreamingService } from './services'
import { TrackExistenceValidator } from './validators'

import { BaseContainer } from '@core/base'

export class TrackContainer extends BaseContainer {
  static getTrackExistenceValidator(): TrackExistenceValidator {
    return this.getInstance(TrackExistenceValidator, () => new TrackExistenceValidator(this.getTrackRepository()))
  }

  static getTrackRepository(): TrackRepository {
    return this.getInstance(TrackRepository, () => new TrackRepository())
  }

  static getTrackQueryService(): TrackQueryService {
    return this.getInstance(
      TrackQueryService,
      () => new TrackQueryService(this.getTrackRepository(), this.getTrackArtistRepository()),
    )
  }

  static getTrackStreamingService(): TrackStreamingService {
    return this.getInstance(TrackStreamingService, () => new TrackStreamingService())
  }

  static getTrackArtistRepository(): TrackArtistRepository {
    return this.getInstance(TrackArtistRepository, () => new TrackArtistRepository())
  }
}
