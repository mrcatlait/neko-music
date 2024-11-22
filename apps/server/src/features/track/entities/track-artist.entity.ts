import { ArtistRole } from '@features/artist/enums'

export interface TrackArtistEntity {
  id: string
  name: string
  role: ArtistRole
}
