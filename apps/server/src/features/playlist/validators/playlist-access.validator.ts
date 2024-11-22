import { AddToPlaylistCommand, ValidatePlaylistAccessCommand } from '../commands'
import { PlaylistRepository } from '../repositories'

import { Validator, ValidationResult } from '@core/validation'

export class PlaylistAccessValidator implements Validator<AddToPlaylistCommand> {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

  async validate(command: ValidatePlaylistAccessCommand): Promise<ValidationResult> {
    const hasAccess = await this.playlistRepository.checkUserAccess(command.playlistId, command.userId)

    return {
      isValid: hasAccess,
      errors: hasAccess ? [] : ['User does not have access to this playlist'],
    }
  }
}
