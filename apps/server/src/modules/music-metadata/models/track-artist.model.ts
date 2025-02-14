import { ArtistRole } from '@modules/music-metadata/enums'

export interface TrackArtist {
  id: string
  name: string
  role: ArtistRole
}
