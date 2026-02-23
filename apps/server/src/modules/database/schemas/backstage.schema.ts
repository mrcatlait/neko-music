import { Generated } from 'kysely'

import { PublishingStatus } from '@/modules/backstage/enums'
import { AlbumType } from '@/modules/catalog/enums'

interface AuditTrail {
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
}

export interface BackstageArtistTable extends AuditTrail {
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

export interface BackstageAlbumTable extends AuditTrail {
  id: Generated<string>
  name: string
  catalogAlbumId: string
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

export interface BackstageTrackTable extends AuditTrail {
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
