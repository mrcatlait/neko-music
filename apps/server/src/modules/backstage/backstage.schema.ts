import { Generated } from 'kysely'

import { PublishingStatus, AlbumType } from './enums'

export interface BackstageArtistTable {
  id: Generated<string>
  name: string
  catalogArtistId: string | null
  verified: boolean
  status: PublishingStatus
}

export interface BackstageArtistGenreTable {
  artistId: string
  genreId: string
  position: number
}

export interface BackstageAlbumTable {
  id: Generated<string>
  name: string
  catalogAlbumId: string | null
  releaseDate: Date
  explicit: boolean
  type: AlbumType
  status: PublishingStatus
}

export interface BackstageAlbumGenreTable {
  albumId: string
  genreId: string
  position: number
}

export interface BackstageAlbumArtistTable {
  albumId: string
  artistId: string
  role: ArtistRole
}

export interface BackstageTrackTable {
  id: Generated<string>
  name: string
  catalogTrackId: string
  albumId: string | null
  trackNumber: number | null
  diskNumber: number | null
  releaseDate: Date
  type: TrackType
  duration: number
  explicit: boolean
  status: PublishingStatus
}

export interface BackstageTrackGenreTable {
  trackId: string
  genreId: string
  position: number
}

export interface BackstageTrackArtistTable {
  trackId: string
  artistId: string
  role: ArtistRole
}

export interface BackstageSchema {
  'backstage.Artist': BackstageArtistTable
  'backstage.ArtistGenre': BackstageArtistGenreTable
  'backstage.Album': BackstageAlbumTable
  'backstage.AlbumGenre': BackstageAlbumGenreTable
  'backstage.AlbumArtist': BackstageAlbumArtistTable
  'backstage.Track': BackstageTrackTable
  'backstage.TrackGenre': BackstageTrackGenreTable
  'backstage.TrackArtist': BackstageTrackArtistTable
}
