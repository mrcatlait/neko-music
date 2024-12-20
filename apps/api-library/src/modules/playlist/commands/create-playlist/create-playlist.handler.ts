import { Injectable } from '@nestjs/common'

import { CreatePlaylistCommand } from './create-playlist.command'

import { CommandHandler } from '@modules/shared/models'
import { PlaylistRepository } from '@modules/playlist/repositories'

@Injectable()
export class CreatePlaylistHandler implements CommandHandler<CreatePlaylistCommand> {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

  handle(command: CreatePlaylistCommand): Promise<void> {
    return this.playlistRepository.create({
      user_id: command.userId,
      name: command.name,
      description: command.description,
      type: command.type,
    })
  }
}
