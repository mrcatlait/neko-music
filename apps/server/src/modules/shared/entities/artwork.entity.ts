type ArtworkSize = 'small' | 'medium' | 'large'

export interface ArtworkEntity {
  url: string
  sizes: ArtworkSize[]
  dominantColor: string
}

export type WithArtwork<T> = T & {
  artwork: ArtworkEntity
}
