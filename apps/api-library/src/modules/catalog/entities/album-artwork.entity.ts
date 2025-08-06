import { ArtworkRole } from '../enums'

export interface AlbumArtworkEntity {
  albumId: string
  mediaAssetId: string
  role: ArtworkRole
}
