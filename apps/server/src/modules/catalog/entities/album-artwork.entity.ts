import { ArtworkEntity } from './artwork.entity'

export interface AlbumArtworkEntity extends ArtworkEntity {
  albumId: string
}
