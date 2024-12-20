import { ArtistRole } from '@modules/artist/enums'

export interface TrackArtistEntity {
  id: string
  name: string
  role: ArtistRole
}
