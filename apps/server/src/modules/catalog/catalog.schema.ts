import { Artwork } from '@/modules/shared/types'
import { AlbumType, TrackType } from '@/modules/shared/enums'

export interface GenreTable {
  id: string
  name: string
  slug: string
}

export interface CatalogArtistTable {
  id: string
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
  id: string
  name: string
  releaseDate: Date
  explicit: boolean
  artwork: Artwork
  type: AlbumType
  artists: { id: string; name: string }[]
}

export interface CatalogAlbumGenreTable {
  albumId: string
  genreId: string
  position: number
}

export interface CatalogAlbumArtistTable {
  albumId: string
  artistId: string
  role: string
}

export interface CatalogTrackTable {
  id: string
  name: string
  albumId: string
  albumName: string
  trackNumber: number
  diskNumber: number
  releaseDate: Date
  type: TrackType
  duration: number
  artwork: Artwork
  playback: any
  explicit: boolean
  artists: { id: string; name: string }[]
  // @todo think is to add hasLyrics column
}

export interface CatalogTrackGenreTable {
  trackId: string
  genreId: string
  position: number
}

export interface CatalogTrackArtistTable {
  trackId: string
  artistId: string
  role: string
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
