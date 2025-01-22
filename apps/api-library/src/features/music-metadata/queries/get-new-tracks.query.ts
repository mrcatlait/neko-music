import { TrackRepository } from '../repositories'
import { TracksPageDto } from '../dtos'

import { PageMetaDto } from '@common/dtos'
import { Handler } from '@common/models'
import { Container } from '@common/di'

export class GetNewTracksQuery implements Handler<void, TracksPageDto> {
  private readonly trackRepository: TrackRepository

  constructor() {
    this.trackRepository = Container.get(TrackRepository)
  }

  handle(): Promise<TracksPageDto> {
    return this.trackRepository.getNewItems({ offset: 0, take: 10 }).then((tracks) => {
      return {
        data: tracks,
        meta: new PageMetaDto({
          pageOptionsDto: {
            offset: 0,
            take: 10,
          },
          hasMore: false,
        }),
      }
    })
  }
}
