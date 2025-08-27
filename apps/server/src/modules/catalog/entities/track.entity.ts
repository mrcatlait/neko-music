import { AlbumType, RecordStatus } from '../enums'
import { WithArtists } from './artist.entity'

export interface TrackEntity {
  id: string
  name: string
  albumId: string
  trackNumber: number
  diskNumber: number
  releaseDate: Date
  duration: number
  hasLyrics: boolean
  explicit: boolean
  status: RecordStatus
}

export type TrackWithAlbumAndArtistsEntity = WithArtists<TrackEntity> & {
  albumName: string
  albumType: AlbumType
}

export type WithTracks<T> = T & {
  tracks: TrackEntity[]
}
