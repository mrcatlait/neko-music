import {
  AddToPlaylistCommand,
  CreatePlaylistCommand,
  DeletePlaylistCommand,
  RemoveFromPlaylistCommand,
  ReorderPlaylistCommand,
  UpdatePlaylistCommand,
} from '../commands'
import { PlaylistTrackEntity } from '../entities'
import { PlaylistRepository, PlaylistTrackRepository } from '../repositories'
import { AddToPlaylistValidator } from '../validators'
import { PlaylistAccessService } from './playlist-access.service'
import { TrackResolverService } from './track-resolver.service'

import { BadRequestException } from '@common/exceptions'

export class PlaylistCommandService {
  constructor(
    private readonly playlistAccessService: PlaylistAccessService,
    private readonly addToPlaylistValidator: AddToPlaylistValidator,
    private readonly playlistTrackRepository: PlaylistTrackRepository,
    private readonly playlistRepository: PlaylistRepository,
    private readonly trackResolverService: TrackResolverService,
  ) {}

  createPlaylist(command: CreatePlaylistCommand): Promise<void> {
    return this.playlistRepository.create({
      user_id: command.userId,
      name: command.name,
      description: command.description,
      type: command.type,
    })
  }

  async deletePlaylist(command: DeletePlaylistCommand): Promise<void> {
    await this.playlistAccessService.validateAccess({
      userId: command.userId,
      playlistId: command.playlistId,
    })

    return this.playlistRepository.delete(command.playlistId)
  }

  async updatePlaylist(command: UpdatePlaylistCommand): Promise<void> {
    await this.playlistAccessService.validateAccess({
      userId: command.userId,
      playlistId: command.playlistId,
    })

    return this.playlistRepository.update({
      id: command.playlistId,
      user_id: command.userId,
      name: command.name,
      description: command.description,
      type: command.type,
    })
  }

  async addToPlaylist(command: AddToPlaylistCommand): Promise<void> {
    await this.playlistAccessService.validateAccess({
      userId: command.userId,
      playlistId: command.playlistId,
    })

    const validationResult = await this.addToPlaylistValidator.validate(command)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors[0])
    }

    const [trackIds, maxPosition] = await Promise.all([
      this.trackResolverService.resolveTrackIds(command.itemId, command.itemType),
      this.playlistTrackRepository.getMaxPosition(command.playlistId),
    ])

    const playlistItems: PlaylistTrackEntity[] = trackIds.map((trackId, index) => ({
      playlist_id: command.playlistId,
      track_id: trackId,
      position: maxPosition + index + 1,
    }))

    return this.playlistTrackRepository.saveItems(playlistItems)
  }

  async removeFromPlaylist(command: RemoveFromPlaylistCommand): Promise<void> {
    await this.playlistAccessService.validateAccess({
      userId: command.userId,
      playlistId: command.playlistId,
    })

    return this.playlistTrackRepository.delete(command.playlistId, command.trackId)
  }

  async reorderPlaylist(command: ReorderPlaylistCommand): Promise<void> {
    await this.playlistAccessService.validateAccess({
      userId: command.userId,
      playlistId: command.playlistId,
    })

    const playlistTracks = await this.playlistTrackRepository.getItems(command.playlistId)

    const tracksToMove = playlistTracks.slice(command.rangeStart, command.rangeEnd + 1)

    const remainingTracks = playlistTracks.filter((_, index) => index < command.rangeStart || index > command.rangeEnd)

    remainingTracks.splice(command.insertBefore, 0, ...tracksToMove)

    const updates = remainingTracks.map((track, index) => ({
      track_id: track.track_id,
      position: index,
    }))

    return this.playlistTrackRepository.updateTrackPositions(updates)
  }
}
