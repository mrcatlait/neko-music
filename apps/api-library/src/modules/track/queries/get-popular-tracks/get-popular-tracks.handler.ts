import { Injectable } from '@nestjs/common'

import { QueryHandler } from '@modules/shared/models'
import { TrackRepository } from '@modules/track/repositories'
import { TracksPageDto } from '@modules/track/dtos'
import { PageMetaDto } from '@modules/shared/dtos'

@Injectable()
export class GetPopularTracksHandler implements QueryHandler<void, TracksPageDto> {
  constructor(private readonly trackRepository: TrackRepository) {}

  handle(): Promise<TracksPageDto> {
    return this.trackRepository.getPopularItems({ offset: 0, take: 10 }).then((tracks) => {
      return new TracksPageDto(
        tracks,
        new PageMetaDto({
          pageOptionsDto: {
            offset: 0,
            take: 10,
          },
          hasMore: false,
        }),
      )
    })
  }
}
