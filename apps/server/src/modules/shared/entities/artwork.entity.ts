type ArtworkSize = 'small' | 'medium' | 'large'

export interface ArtworkEntity {
  url: string
  sizes: ArtworkSize[]
  dominantColor: string
}
