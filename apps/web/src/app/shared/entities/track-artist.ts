import type { ArtistRole } from '../enums'

export interface TrackArtist {
  /**
   * The unique identifier of the artist.
   */
  id: string
  /**
   * The name of the artist.
   */
  name: string
  /**
   * The role of the artist in the track.
   */
  role: ArtistRole
}
