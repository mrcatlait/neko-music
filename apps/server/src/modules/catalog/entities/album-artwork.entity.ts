import { ArtworkEntity } from '@/modules/shared/entities'

export interface AlbumArtworkEntity extends ArtworkEntity {
  albumId: string
}
