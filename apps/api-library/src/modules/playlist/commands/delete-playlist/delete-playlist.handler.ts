import { Injectable } from '@nestjs/common'

import { DeletePlaylistCommand } from './delete-playlist.command'

import { CommandHandler } from '@modules/shared/models'
import { PlaylistRepository } from '@modules/playlist/repositories'

@Injectable()
export class DeletePlaylistHandler implements CommandHandler<DeletePlaylistCommand> {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

  handle(command: DeletePlaylistCommand): Promise<void> {
    return this.playlistRepository.delete(command.playlistId)
  }
}
