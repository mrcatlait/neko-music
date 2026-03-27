import { SharedDtos } from '../../shared'

import type { Genre } from '../genres/genre'

/** Album rows returned when `include=albums` is used on an artist. */
export interface ArtistAlbum {
  id: string
  name: string
  releaseDate: Date
  explicit: boolean
  type: string
  status: string
  artwork?: SharedDtos.Dtos.Artwork | null
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
}

export interface Artist {
  id: string
  name: string
  verified: boolean
  artwork?: SharedDtos.Dtos.Artwork | null
  status: string
  createdAt: Date
  createdBy: string
  updatedAt: Date
  updatedBy: string
  /** Present when requested via `include=genres`. */
  genres?: Genre[]
  /** Present when requested via `include=albums`. */
  albums?: ArtistAlbum[]
}
