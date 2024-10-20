import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { PlaylistEntity, PlaylistTrackEntity } from './entities'
import { CreatePlaylistDto, PlaylistDto, PlaylistPageDto, PlaylistPageOptionsDto, UpdatePlaylistDto } from './dto'

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
    const playlist = this.playlistRepository.create({ userId: user.user.id, name: playlistDto.name })

    return this.playlistRepository.save(playlist).then((p) => p.toDto())
  }

  async updatePlaylist(playlistId: string, playlistDto: UpdatePlaylistDto): Promise<void> {
    const playlist = await this.playlistRepository.findOne({ relations: { tracks: true }, where: { id: playlistId } })

    if (!playlist) {
      throw new NotFoundException()
    }

    if (playlistDto.addSong && !playlist.tracks.some((song) => song.id === playlistDto.addSong)) {
      const playlistTrack = new PlaylistTrackEntity()
      playlistTrack.playlistId = playlist.id
      playlistTrack.trackId = playlistDto.addSong

      await this.playlistTrackRepository.insert(playlistTrack)
    }
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
