import { TrackRepository } from '../repositories'
import { TracksPageDto } from '../dtos'

import { Handler } from '@common/models'
import { PageMetaDto } from '@common/dtos'
import { Container } from '@common/di'

interface GetArtistTracksQueryParams {
  artistId: string
}

export class GetArtistTracksQuery implements Handler<GetArtistTracksQueryParams, TracksPageDto> {
  private readonly trackRepository: TrackRepository

  constructor() {
    this.trackRepository = Container.get(TrackRepository)
  }

  handle(query: GetArtistTracksQueryParams): Promise<TracksPageDto> {
    return this.trackRepository.getItemsByArtistId(query.artistId).then((tracks) => ({
      data: tracks,
      meta: new PageMetaDto({
        pageOptionsDto: {
          offset: 0,
          take: tracks.length,
        },
        hasMore: false,
      }),
    }))
  }
}
