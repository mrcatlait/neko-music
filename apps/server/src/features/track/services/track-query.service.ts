import { QueueTrack, Track } from '../models'
import { GetAlbumTrackIdsQuery, GetAlbumTracksQuery } from '../queries'
import { TrackArtistRepository, TrackRepository } from '../repositories'

import { GetArtistQueueQuery, GetArtistTracksQuery } from '@features/artist/queries'

export class TrackQueryService {
  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly trackArtistRepository: TrackArtistRepository,
  ) {}

  getAlbumTracks(query: GetAlbumTracksQuery): Promise<Track[]> {
    return this.trackRepository.getItemsByAlbumId(query.albumId)
  }

  getAlbumTrackIds(query: GetAlbumTrackIdsQuery): Promise<string[]> {
    return this.trackRepository.getAlbumTrackIds(query.albumId)
  }

  async getArtistTracks(query: GetArtistTracksQuery): Promise<Track[]> {
    const trackIds = await this.trackArtistRepository.getItemIds(query.artistId, query.pageOptionsDto)
    return this.trackRepository.getItems(trackIds)
  }

  async getArtistQueueTracks(query: GetArtistQueueQuery): Promise<QueueTrack[]> {
    const trackIds = await this.trackArtistRepository.getItemIdsFull(query.artistId)
    return this.trackRepository.getQueueItems(trackIds)
  }

  getNewTracks(): Promise<Track[]> {
    return this.trackRepository.getNewItems({ offset: 0, take: 10 })
  }

  getPopularTracks(): Promise<Track[]> {
    return this.trackRepository.getPopularItems({ offset: 0, take: 10 })
  }
}
