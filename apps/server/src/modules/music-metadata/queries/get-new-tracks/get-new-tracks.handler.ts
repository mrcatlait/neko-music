import { Injectable } from '@nestjs/common'

import { QueryHandler } from '@modules/shared/models'
import { PageMetaDto } from '@modules/shared/dtos'
import { TracksPageDto } from '@modules/music-metadata/dtos'
import { TrackRepository } from '@modules/music-metadata/repositories'

@Injectable()
export class GetNewTracksHandler implements QueryHandler<void, TracksPageDto> {
  constructor(private readonly trackRepository: TrackRepository) {}

  handle(): Promise<TracksPageDto> {
    return this.trackRepository.getNewItems({ offset: 0, take: 10 }).then((tracks) => {
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
