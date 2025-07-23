export interface ArtworkEntity {
  url: string
  backgroundColor: string
  textColor: string
}

export type WithArtwork<T> = T & {
  artwork: ArtworkEntity
}

export type WithArtworkAndId<T> = T & {
  artwork: ArtworkEntity
  artworkId: string
}
