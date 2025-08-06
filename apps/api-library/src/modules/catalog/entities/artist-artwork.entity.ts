import { ArtworkRole } from '../enums'

export interface ArtistArtworkEntity {
  artistId: string
  mediaAssetId: string
  role: ArtworkRole
}
