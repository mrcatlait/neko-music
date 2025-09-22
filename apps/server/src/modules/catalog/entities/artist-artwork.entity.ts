import { ArtworkEntity } from '@/modules/shared/entities'

export interface ArtistArtworkEntity extends ArtworkEntity {
  artistId: string
}
