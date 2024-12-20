import { Injectable } from '@nestjs/common'

import { AddToPlaylistCommand } from './add-to-playlist.command'
import { PlaylistTrackEntity } from '../../entities'
import { PlaylistTrackRepository } from '../../repositories'
import { TrackResolverService } from '../../services'

import { CommandHandler } from '@modules/shared/models'

@Injectable()
export class AddToPlaylistHandler implements CommandHandler<AddToPlaylistCommand> {
  constructor(
    private readonly playlistTrackRepository: PlaylistTrackRepository,
    private readonly trackResolverService: TrackResolverService,
  ) {}

  async handle(command: AddToPlaylistCommand): Promise<void> {
    // await this.playlistAccessService.validateAccess({
    //   userId: command.userId,
    //   playlistId: command.playlistId,
    // })

    // const validationResult = await this.addToPlaylistValidator.validate(command)

    // if (!validationResult.isValid) {
    //   throw new BadRequestException(validationResult.errors[0])
    // }

    const [trackIds, maxPosition] = await Promise.all([
      this.trackResolverService.resolveTrackIds(command.collectionId, command.collectionType),
      this.playlistTrackRepository.getMaxPosition(command.playlistId),
    ])

    const playlistItems: PlaylistTrackEntity[] = trackIds.map((trackId, index) => ({
      playlist_id: command.playlistId,
      track_id: trackId,
      position: maxPosition + index + 1,
    }))

    return this.playlistTrackRepository.saveItems(playlistItems)
  }
}
