import { Injectable } from '@nestjs/common'

import { GetPlaylistTracksQuery } from './get-playlist-tracks.query'

import { QueryHandler } from '@modules/shared/models'
import { TracksPageDto } from '@modules/track/dtos'
import { TrackRepository } from '@modules/track/repositories'
import { PageMetaDto } from '@modules/shared/dtos'

@Injectable()
export class GetPlaylistTracksHandler implements QueryHandler<GetPlaylistTracksQuery, TracksPageDto> {
  constructor(private readonly trackRepository: TrackRepository) {}

  async handle(query: GetPlaylistTracksQuery): Promise<TracksPageDto> {
    return this.trackRepository.getItemsByPlaylistId(query.playlistId).then(
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
