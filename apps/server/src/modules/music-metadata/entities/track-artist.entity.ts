import { ArtistRole } from '@modules/music-metadata/enums'

export interface TrackArtistEntity {
  id: string
  name: string
  role: ArtistRole
}
