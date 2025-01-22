import { PlaylistRepository } from '../repositories'
import { PlaylistsPageDto } from '../dtos'

import { PageMetaDto, PageOptionsDto } from '@common/dtos'
import { Handler } from '@common/models'
import { Container } from '@common/di'

export interface GetUserPlaylistsQueryParams {
  userId: string
  pageOptionsDto: PageOptionsDto
}

export class GetUserPlaylistsQuery implements Handler<GetUserPlaylistsQueryParams, PlaylistsPageDto> {
  private readonly playlistRepository: PlaylistRepository

  constructor() {
    this.playlistRepository = Container.get(PlaylistRepository)
  }

  async handle(query: GetUserPlaylistsQueryParams): Promise<PlaylistsPageDto> {
    return this.playlistRepository.getItems(query.userId, query.pageOptionsDto).then((result) => {
      return {
        data: result.data,
        meta: new PageMetaDto({
          pageOptionsDto: query.pageOptionsDto,
          hasMore: result.hasMore,
        }),
      }
    })
  }
}
