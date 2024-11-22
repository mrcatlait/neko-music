import { AddToPlaylistCommand } from '../commands'

import { AlbumExistenceValidator } from '@features/album/validators'
import { TrackExistenceValidator } from '@features/track/validators'
import { Validator, ValidationResult } from '@core/validation'
import { CollectionType } from '@common/enums'

export class AddToPlaylistValidator implements Validator<AddToPlaylistCommand> {
  constructor(
    private readonly trackExistenceValidator: TrackExistenceValidator,
    private readonly albumExistenceValidator: AlbumExistenceValidator,
  ) {}

  async validate(command: AddToPlaylistCommand): Promise<ValidationResult> {
    const existenceValidator =
      command.itemType === CollectionType.ALBUM ? this.albumExistenceValidator : this.trackExistenceValidator

    return existenceValidator.validate(command.itemId)
  }
}
