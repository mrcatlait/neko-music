export interface ArtworkEntity {
  url: string
  backgroundColor: string
  textColor: string
}

export type WithArtwork<T> = T & {
  artwork: ArtworkEntity
}

export type WithArtworkAndMediaFile<T> = T & {
  artwork: ArtworkEntity
  mediaFileId: string
}
