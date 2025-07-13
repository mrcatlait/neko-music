import { ArtistRole } from '../enums'

export interface AlbumArtistEntity {
  album_id: string
  artist_id: string
  role: ArtistRole
  created_at: Date
}
