import { Injectable } from '@nestjs/common'

import { UpdatePlaylistCommand } from './update-playlist.command'
import { PlaylistRepository } from '../../repositories'

import { CommandHandler } from '@modules/shared/models'

@Injectable()
export class UpdatePlaylistHandler implements CommandHandler<UpdatePlaylistCommand> {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

  async handle(command: UpdatePlaylistCommand): Promise<void> {
    // await this.playlistAccessService.validateAccess({
    //   userId: command.userId,
    //   playlistId: command.playlistId,
    // })

    return this.playlistRepository.update({
      id: command.playlistId,
      user_id: command.userId,
      name: command.name,
      description: command.description,
      type: command.type,
    })
  }
}
