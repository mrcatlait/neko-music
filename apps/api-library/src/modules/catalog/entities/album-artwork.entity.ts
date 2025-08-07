import { ArtworkRole } from '../enums'

export interface AlbumArtworkEntity {
  albumId: string
  mediaAssetId: string
  role: ArtworkRole
  publicUrl: string
  dominantColor: string
}

export type WithAlbumArtworks<T> = T & {
  artworks: AlbumArtworkEntity[]
}
