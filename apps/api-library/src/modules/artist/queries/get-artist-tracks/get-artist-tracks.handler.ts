import { Injectable } from '@nestjs/common'

import { GetArtistTracksQuery } from './get-artist-tracks.query'

import { QueryHandler } from '@modules/shared/models'
import { TrackRepository } from '@modules/track/repositories'
import { TracksPageDto } from '@modules/track/dtos'
import { PageMetaDto } from '@modules/shared/dtos'

@Injectable()
export class GetArtistTracksHandler implements QueryHandler<GetArtistTracksQuery, TracksPageDto> {
  constructor(private readonly trackRepository: TrackRepository) {}

  handle(query: GetArtistTracksQuery): Promise<TracksPageDto> {
    return this.trackRepository.getItemsByArtistId(query.artistId).then(
      (tracks) =>
        new TracksPageDto(
          tracks,
          new PageMetaDto({
            pageOptionsDto: {
              offset: 0,
              take: tracks.length,
            },
            hasMore: false,
          }),
        ),
    )
  }
}
