import { Generated } from 'kysely'

import { PublishingStatus } from './shared/enums'
import { Artwork, Playback } from '../shared/types'
import { AlbumType, TrackType } from '../shared/enums'

interface AuditableTable {
  createdAt: Generated<Date>
  createdBy: string
  updatedAt: Generated<Date>
  updatedBy: string
}

export interface BackstageGenreTable extends AuditableTable {
  id: Generated<string>
  name: string
  slug: string
  status: PublishingStatus
  // @todo add parentId
}

export interface BackstageArtistTable extends AuditableTable {
  id: Generated<string>
  name: string
  verified: boolean
  status: PublishingStatus
  artwork: Artwork | null
}

export interface BackstageArtistGenreTable {
  artistId: string
  genreId: string
  position: number
}

export interface BackstageAlbumTable extends AuditableTable {
  id: Generated<string>
  name: string
  releaseDate: Date
  explicit: boolean
  type: AlbumType
  artwork?: Artwork
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
  role: string
}

export interface BackstageTrackTable extends AuditableTable {
  id: Generated<string>
  name: string
  albumId: string
  trackNumber: number
  diskNumber: number
  releaseDate: Date
  type: TrackType
  explicit: boolean
  status: PublishingStatus
  artwork?: Artwork
  playback?: Playback
}

export interface BackstageTrackGenreTable {
  trackId: string
  genreId: string
  position: number
}

export interface BackstageTrackArtistTable {
  trackId: string
  artistId: string
  role: string
}

export interface BackstageSchema {
  'backstage.Genre': BackstageGenreTable
  'backstage.Artist': BackstageArtistTable
  'backstage.ArtistGenre': BackstageArtistGenreTable
  'backstage.Album': BackstageAlbumTable
  'backstage.AlbumGenre': BackstageAlbumGenreTable
  'backstage.AlbumArtist': BackstageAlbumArtistTable
  'backstage.Track': BackstageTrackTable
  'backstage.TrackGenre': BackstageTrackGenreTable
  'backstage.TrackArtist': BackstageTrackArtistTable
}
