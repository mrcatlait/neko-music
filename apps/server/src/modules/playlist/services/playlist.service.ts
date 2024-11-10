import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { PlaylistEntity, PlaylistTrackEntity } from '../entities'
import {
  AddPlaylistTrackDto,
  CreatePlaylistDto,
  PlaylistDto,
  PlaylistPageDto,
  PlaylistPageOptionsDto,
  RemovePlaylistTrackDto,
  UpdatePlaylistDto,
  UpdatePlaylistTracksDto,
} from '../dto'
import { PlaylistType } from '../constants'

import { UserAccountEntity } from '@modules/user/entities'
import { PageMetaDto } from '@common/dto'
import { UserModel } from '@modules/authorization/models'

@Injectable()
export class PlaylistService {
  constructor(
    @InjectRepository(PlaylistEntity)
    private readonly playlistRepository: Repository<PlaylistEntity>,
    @InjectRepository(PlaylistTrackEntity)
    private readonly playlistTrackRepository: Repository<PlaylistTrackEntity>,
  ) {}

  async getPlaylists(user: UserAccountEntity, pageOptionsDto: PlaylistPageOptionsDto): Promise<PlaylistPageDto> {
    const [playlists, playlistCount] = await this.playlistRepository.findAndCount({
      relations: { tracks: { artists: true, images: true } },
      where: { userId: user.id },
      order: { name: 'asc' },
      skip: pageOptionsDto.offset,
      take: pageOptionsDto.take,
    })

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount: playlistCount,
    })

    return new PlaylistPageDto(playlists.toDtos(), pageMetaDto)
  }

  createPlaylist(user: UserModel, playlistDto: CreatePlaylistDto): Promise<PlaylistDto> {
    const playlist = this.playlistRepository.create({
      userId: user.user.id,
      name: playlistDto.name,
      type: playlistDto.isPublic ? PlaylistType.PUBLIC : PlaylistType.PRIVATE,
    })

    return this.playlistRepository.save(playlist).then((p) => p.toDto())
  }

  async updatePlaylist(user: UserModel, playlistId: string, playlistDto: UpdatePlaylistDto): Promise<void> {
    const playlist = await this.playlistRepository.findOne({
      relations: { tracks: true },
      where: { id: playlistId, userId: user.user.id },
    })

    if (!playlist) {
      throw new NotFoundException()
    }

    const updatedPlaylist = this.playlistRepository.create({
      ...playlist,
      ...playlistDto,
      type: playlistDto.isPublic ? PlaylistType.PUBLIC : PlaylistType.PRIVATE,
    })

    await this.playlistRepository.save(updatedPlaylist)
  }

  async deletePlaylist(user: UserModel, playlistId: string): Promise<void> {
    const playlist = await this.playlistRepository.findOne({ where: { id: playlistId, userId: user.user.id } })

    if (!playlist) {
      throw new NotFoundException()
    }

    await this.playlistRepository.delete(playlistId)
  }

  async addTracksToPlaylist(
    user: UserModel,
    playlistId: string,
    addPlaylistTrackDto: AddPlaylistTrackDto,
  ): Promise<void> {
    const playlist = await this.playlistRepository.findOne({ where: { id: playlistId, userId: user.user.id } })

    if (!playlist) {
      throw new NotFoundException()
    }

    const currentMaxPosition = (await this.playlistTrackRepository.maximum('position', { playlistId })) || 1

    await this.playlistTrackRepository.insert(
      addPlaylistTrackDto.tracks.map((trackId, index) => ({
        playlistId,
        trackId,
        position: currentMaxPosition + index,
      })),
    )
  }

  async removeTracksFromPlaylist(
    user: UserModel,
    playlistId: string,
    removePlaylistTrackDto: RemovePlaylistTrackDto,
  ): Promise<void> {
    const playlist = await this.playlistRepository.findOne({ where: { id: playlistId, userId: user.user.id } })

    if (!playlist) {
      throw new NotFoundException()
    }

    await this.playlistTrackRepository.delete({ playlistId, trackId: In(removePlaylistTrackDto.tracks) })
  }

  async updateTracksInPlaylist(
    user: UserModel,
    playlistId: string,
    updatePlaylistTracksDto: UpdatePlaylistTracksDto,
  ): Promise<void> {
    const playlist = await this.playlistRepository.findOne({
      where: { id: playlistId, userId: user.user.id },
      relations: { tracks: true },
    })

    if (!playlist) {
      throw new NotFoundException()
    }

    const { rangeStart, rangeEnd, insertBefore } = updatePlaylistTracksDto

    const playlistTracks = await this.playlistTrackRepository.find({
      where: { playlistId },
      order: { position: 'asc' },
    })

    const tracksToMove = playlistTracks.slice(rangeStart, rangeEnd + 1)

    const remainingTracks = playlistTracks.filter((_, index) => index < rangeStart || index > rangeEnd)

    remainingTracks.splice(insertBefore, 0, ...tracksToMove)

    const updates = remainingTracks.map((track, index) => ({
      id: track.id,
      position: index,
    }))

    await this.playlistTrackRepository.save(updates)
  }

  async searchPlaylist(playlistId: string): Promise<PlaylistDto> {
    const playlist = await this.playlistRepository.findOne({
      relations: { tracks: { artists: true, images: true } },
      where: { id: playlistId },
    })

    if (!playlist) {
      throw new NotFoundException()
    }

    return playlist.toDto()
  }
}
