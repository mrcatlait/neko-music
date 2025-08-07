import { ArtworkRole } from '../enums'

export interface ArtistArtworkEntity {
  artistId: string
  mediaAssetId: string
  role: ArtworkRole
  publicUrl: string
  dominantColor: string
}

export type WithArtistArtworks<T> = T & {
  artworks: ArtistArtworkEntity[]
}
