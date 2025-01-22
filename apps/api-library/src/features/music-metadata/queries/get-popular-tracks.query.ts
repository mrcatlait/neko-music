import { TracksPageDto } from '../dtos'
import { TrackRepository } from '../repositories'

import { PageMetaDto } from '@common/dtos'
import { Handler } from '@common/models'
import { Container } from '@common/di'

export class GetPopularTracksHandler implements Handler<void, TracksPageDto> {
  private readonly trackRepository: TrackRepository

  constructor() {
    this.trackRepository = Container.get(TrackRepository)
  }

  handle(): Promise<TracksPageDto> {
    return this.trackRepository.getPopularItems({ offset: 0, take: 10 }).then((tracks) => ({
      data: tracks,
      meta: new PageMetaDto({
        pageOptionsDto: {
          offset: 0,
          take: 10,
        },
        hasMore: false,
      }),
    }))
  }
}
