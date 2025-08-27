import { AlbumType, RecordStatus } from '../enums'

export interface AlbumEntity {
  id: string
  name: string
  releaseDate: Date
  explicit: boolean
  type: AlbumType
  status: RecordStatus
}

export type WithAlbum<T> = T & {
  album: AlbumEntity
}
