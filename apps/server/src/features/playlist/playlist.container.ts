import { PlaylistRepository, PlaylistTrackRepository } from './repositories'
import { PlaylistAccessService, PlaylistCommandService, PlaylistQueryService, TrackResolverService } from './services'
import { AddToPlaylistValidator, PlaylistAccessValidator } from './validators'

import { TrackContainer } from '@features/track'
import { BaseContainer } from '@core/base'
import { AlbumContainer } from '@features/album'

export class PlaylistContainer extends BaseContainer {
  static getAddToPlaylistValidator(): AddToPlaylistValidator {
    return this.getInstance(
      AddToPlaylistValidator,
      () =>
        new AddToPlaylistValidator(
          TrackContainer.getTrackExistenceValidator(),
          AlbumContainer.getAlbumExistenceValidator(),
        ),
    )
  }

  static getPlaylistAccessValidator(): PlaylistAccessValidator {
    return this.getInstance(PlaylistAccessValidator, () => new PlaylistAccessValidator(this.getPlaylistRepository()))
  }

  static getPlaylistRepository(): PlaylistRepository {
    return this.getInstance(PlaylistRepository, () => new PlaylistRepository())
  }

  static getPlaylistTrackRepository(): PlaylistTrackRepository {
    return this.getInstance(PlaylistTrackRepository, () => new PlaylistTrackRepository())
  }

  static getTrackResolverService(): TrackResolverService {
    return this.getInstance(
      TrackResolverService,
      () => new TrackResolverService(TrackContainer.getTrackRepository(), this.getPlaylistTrackRepository()),
    )
  }

  static getPlaylistAccessService(): PlaylistAccessService {
    return this.getInstance(PlaylistAccessService, () => new PlaylistAccessService(this.getPlaylistAccessValidator()))
  }

  static getPlaylistQueryService(): PlaylistQueryService {
    return this.getInstance(
      PlaylistQueryService,
      () =>
        new PlaylistQueryService(
          this.getPlaylistRepository(),
          this.getPlaylistTrackRepository(),
          this.getTrackResolverService(),
        ),
    )
  }

  static getPlaylistCommandService(): PlaylistCommandService {
    return this.getInstance(
      PlaylistCommandService,
      () =>
        new PlaylistCommandService(
          this.getPlaylistAccessService(),
          this.getAddToPlaylistValidator(),
          this.getPlaylistTrackRepository(),
          this.getPlaylistRepository(),
          this.getTrackResolverService(),
        ),
    )
  }
}
