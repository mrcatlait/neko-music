import type { Artwork } from './artwork'
import type { TrackAlbum } from './track-album'
import type { TrackArtist } from './track-artist'

export interface Track {
  /**
   * The unique identifier for the track.
   */
  id: string
  /**
   * The title of the track.
   */
  title: string
  /**
   * The artwork for the track.
   */
  artwork: Artwork
  /**
   * The album the track belongs to.
   */
  album: TrackAlbum
  /**
   * The artists associated with the track and their roles.
   */
  artists: TrackArtist[]
  /**
   * The duration of the track in seconds.
   */
  duration: number
  /**
   * The genre names of the track.
   */
  genres: string[]
  // albumId: string
  /**
   * The disk number of album the track belongs to.
   */
  diskNumber: number
  /**
   * The track number of the album the track belongs to.
   */
  trackNumber: number
  /**
   * Indicates if the track has lyrics.
   */
  hasLyrics: boolean
  /**
   * Indicates if the track has explicit language.
   */
  explicit: boolean
  /**
   * The release date of the track in format `YYYY-MM-DD`.
   * @example `2025-01-01`
   */
  releaseDate: string
}
