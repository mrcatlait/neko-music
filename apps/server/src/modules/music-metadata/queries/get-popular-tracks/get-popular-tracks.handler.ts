import { Injectable } from '@nestjs/common'

import { QueryHandler } from '@modules/shared/models'
import { PageMetaDto } from '@modules/shared/dtos'
import { TrackRepository } from '@modules/music-metadata/repositories'
import { TracksPageDto } from '@modules/music-metadata/dtos'

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
