import type { ArtistRole } from '../enums'

export interface AlbumArtist {
  /**
   * The unique identifier of the album artist.
   */
  id: string
  /**
   * The name of the artist.
   */
  name: string
  /**
   * The role of the artist in the album.
   */
  role: ArtistRole
}
