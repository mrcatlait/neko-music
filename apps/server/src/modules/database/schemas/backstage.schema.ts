import { Generated } from 'kysely'

import { PublishingStatus } from '@/modules/backstage/enums'
import { AlbumType } from '@/modules/catalog/enums'

interface AuditTrail {
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
}

export interface ArtistTable extends AuditTrail {
  id: Generated<string>
  name: string
  catalogArtistId: string
  verified: boolean
  status: PublishingStatus
}

export interface ArtistGenreTable {
  artistId: string
  genreId: string
  position: number
}

export interface AlbumTable extends AuditTrail {
  id: Generated<string>
  name: string
  catalogAlbumId: string
  releaseDate: Date
  explicit: boolean
  type: AlbumType
  status: PublishingStatus
}

export interface AlbumGenreTable {
  albumId: string
  genreId: string
  position: number
}

export interface AlbumArtistTable {
  albumId: string
  artistId: string
  role: ArtistRole
}

export interface TrackTable extends AuditTrail {
  id: Generated<string>
  name: string
  catalogTrackId: string
  albumId: string
  trackNumber: number
  diskNumber: number
  releaseDate: Date
  type: TrackType
  duration: number
  explicit: boolean
  status: PublishingStatus
}

export interface TrackGenreTable {
  trackId: string
  genreId: string
  position: number
}

export interface TrackArtistTable {
  trackId: string
  artistId: string
  role: ArtistRole
}

export interface BackstageSchema {
  'backstage.Artist': ArtistTable
  'backstage.ArtistGenre': ArtistGenreTable
  'backstage.Album': AlbumTable
  'backstage.AlbumGenre': AlbumGenreTable
  'backstage.AlbumArtist': AlbumArtistTable
  'backstage.Track': TrackTable
  'backstage.TrackGenre': TrackGenreTable
  'backstage.TrackArtist': TrackArtistTable
}
