import { Generated } from 'kysely'

import { AlbumType } from '@/modules/catalog/enums'
import { Artwork } from '@/modules/shared/interfaces'

export interface GenreTable {
  id: Generated<string>
  name: string
}

export interface CatalogArtistTable {
  id: Generated<string>
  name: string
  artwork: Artwork
  verified: boolean
}

export interface CatalogArtistGenreTable {
  artistId: string
  genreId: string
  position: number
}

export interface CatalogAlbumTable {
  id: Generated<string>
  name: string
  releaseDate: Date
  explicit: boolean
  artwork: JSON
  type: AlbumType
}

export interface CatalogAlbumGenreTable {
  albumId: string
  genreId: string
  position: number
}

export interface CatalogAlbumArtistTable {
  albumId: string
  artistId: string
  role: ArtistRole
}

export interface CatalogTrackTable {
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

export interface CatalogTrackGenreTable {
  trackId: string
  genreId: string
  position: number
}

export interface CatalogTrackArtistTable {
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
  'catalog.Artist': CatalogArtistTable
  'catalog.ArtistGenre': CatalogArtistGenreTable
  'catalog.Album': CatalogAlbumTable
  'catalog.AlbumGenre': CatalogAlbumGenreTable
  'catalog.AlbumArtist': CatalogAlbumArtistTable
  'catalog.Track': CatalogTrackTable
  'catalog.TrackGenre': CatalogTrackGenreTable
  'catalog.TrackArtist': CatalogTrackArtistTable
  'catalog.Lyrics': LyricsTable
}
