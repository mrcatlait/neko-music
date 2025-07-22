import { AlbumType } from '../enums'

export interface AlbumEntity {
  id: string
  name: string
  releaseDate: Date
  explicit: boolean
  type: AlbumType
  mediaFileId: string
}

export type WithAlbum<T> = T & {
  album: AlbumEntity
}
