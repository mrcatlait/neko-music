import type { AlbumType } from '../enums'
import type { AlbumArtist } from './album-artist.model'
import type { Artwork } from './artwork.model'

export interface Album {
  /**
   * The unique identifier of the album.
   */
  id: string
  /**
   * The title of the album.
   */
  title: string
  /**
   * The release date of the album in format `YYYY-MM-DD`.
   * @example `2025-01-01`
   */
  releaseDate: string
  /**
   * Indicates if the album has explicit content.
   */
  explicit: boolean
  /**
   * The artwork of the album.
   */
  artwork: Artwork
  /**
   * The artists associated with the album.
   */
  artists: AlbumArtist[]
  /**
   * The type of the album.
   */
  type: AlbumType
  /**
   * The genres of the album.
   */
  genres: string[]
}
