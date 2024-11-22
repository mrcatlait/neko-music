import { ValidatePlaylistAccessCommand } from '../commands'
import { PlaylistAccessValidator } from '../validators'

import { ForbiddenException } from '@common/exceptions'

export class PlaylistAccessService {
  constructor(private readonly playlistAccessValidator: PlaylistAccessValidator) {}

  async validateAccess(command: ValidatePlaylistAccessCommand): Promise<void> {
    const result = await this.playlistAccessValidator.validate(command)

    if (!result.isValid) {
      throw new ForbiddenException(result.errors[0])
    }
  }
}
