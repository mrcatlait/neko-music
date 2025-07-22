import { AlbumType } from '../enums'
import { WithArtists } from './artist.entity'
import { WithArtwork } from './artwork.entity'

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
}

export type TrackWithAlbumAndArtistsEntity = WithArtwork<WithArtists<TrackEntity>> & {
  albumName: string
  albumType: AlbumType
}

export type WithTracks<T> = T & {
  tracks: TrackEntity[]
}
