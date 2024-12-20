import { Injectable } from '@nestjs/common'

import { GetUserPlaylistsQuery } from './get-user-playlists.query'

import { PlaylistPageDto } from '@modules/playlist/dto'
import { QueryHandler } from '@modules/shared/models'
import { PlaylistRepository } from '@modules/playlist/repositories'
import { PageMetaDto } from '@modules/shared/dtos'

@Injectable()
export class GetUserPlaylistsHandler implements QueryHandler<GetUserPlaylistsQuery, PlaylistPageDto> {
  constructor(private readonly playlistRepository: PlaylistRepository) {}

  async handle(query: GetUserPlaylistsQuery): Promise<PlaylistPageDto> {
    return this.playlistRepository.getItems(query.userId, query.pageOptionsDto).then((result) => {
      return new PlaylistPageDto(
        result.data,
        new PageMetaDto({
          pageOptionsDto: query.pageOptionsDto,
          hasMore: result.hasMore,
        }),
      )
    })
  }
}
