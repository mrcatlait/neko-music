import { GetArtistQuery, GetArtistQueueQuery, GetArtistTracksQuery } from '../queries'
import { Artist } from '../models'
import { ArtistRepository } from '../repositories'

import { Track, QueueTrack } from '@features/track/models'
import { NotFoundException } from '@common/exceptions'
import { TrackQueryService } from '@features/track/services'

export class ArtistQueryService {
  constructor(
    private readonly artistRepository: ArtistRepository,
    private readonly trackQueryService: TrackQueryService,
  ) {}

  async getArtist(query: GetArtistQuery): Promise<Artist> {
    const artist = await this.artistRepository.getById(query.artistId)

    if (!artist) {
      throw new NotFoundException()
    }

    return artist
  }

  async getArtistTracks(query: GetArtistTracksQuery): Promise<Track[]> {
    return this.trackQueryService.getArtistTracks(query)
  }

  async getArtistQueueTracks(query: GetArtistQueueQuery): Promise<QueueTrack[]> {
    return this.trackQueryService.getArtistQueueTracks(query)
  }
}
