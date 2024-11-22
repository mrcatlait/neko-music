import { AlbumRepository } from './repositories'
import { AlbumExistenceValidator } from './validators'

import { BaseContainer } from '@core/base'

export class AlbumContainer extends BaseContainer {
  static getAlbumExistenceValidator(): AlbumExistenceValidator {
    return this.getInstance(AlbumExistenceValidator, () => new AlbumExistenceValidator(this.getAlbumRepository()))
  }

  static getAlbumRepository(): AlbumRepository {
    return this.getInstance(AlbumRepository, () => new AlbumRepository())
  }
}
