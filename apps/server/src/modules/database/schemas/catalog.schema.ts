import { Generated } from 'kysely'

import { AlbumType } from '@/modules/catalog/enums'
import { Artwork } from '@/modules/shared/interfaces'

export interface GenreTable {
  id: Generated<string>
  name: string
}

export interface ArtistTable {
  id: Generated<string>
  name: string
  artwork: Artwork
  verified: boolean
}

export interface ArtistGenreTable {
  artistId: string
  genreId: string
  position: number
}

export interface AlbumTable {
  id: Generated<string>
  name: string
  releaseDate: Date
  explicit: boolean
  artwork: JSON
  type: AlbumType
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

export interface TrackTable {
  id: Generated<string>
  name: string
  albumId: string
  trackNumber: number
  diskNumber: number
  releaseDate: Date
  type: TrackType
  duration: number
  artwork: JSON
  playback: JSON
  explicit: boolean
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

export interface LyricsTable {
  trackId: string
  lyrics: string
  synced: boolean
}

export interface CatalogSchema {
  'catalog.Genre': GenreTable
  'catalog.Artist': ArtistTable
  'catalog.ArtistGenre': ArtistGenreTable
  'catalog.Album': AlbumTable
  'catalog.AlbumGenre': AlbumGenreTable
  'catalog.AlbumArtist': AlbumArtistTable
  'catalog.Track': TrackTable
  'catalog.TrackGenre': TrackGenreTable
  'catalog.TrackArtist': TrackArtistTable
  'catalog.Lyrics': LyricsTable
}
