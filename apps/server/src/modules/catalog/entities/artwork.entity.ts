export interface ArtworkEntity {
  mediaAssetId: string
  url: string
  height: number
  width: number
  dominantColor: string
}

export type WithArtworks<T> = T & {
  artworks: ArtworkEntity[]
}
