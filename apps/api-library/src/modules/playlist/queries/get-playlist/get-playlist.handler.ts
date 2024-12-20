import { Injectable } from '@nestjs/common'

import { GetPlaylistQuery } from './get-playlist.query'

import { QueryHandler } from '@modules/shared/models'
import { PlaylistDto } from '@modules/playlist/dto'
import { PlaylistRepository } from '@modules/playlist/repositories'

@Injectable()
export class GetPlaylistHandler implements QueryHandler<GetPlaylistQuery, PlaylistDto> {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

  handle(query: GetPlaylistQuery): Promise<PlaylistDto> {
    return this.playlistRepository.getById(query.playlistId)
  }
}
