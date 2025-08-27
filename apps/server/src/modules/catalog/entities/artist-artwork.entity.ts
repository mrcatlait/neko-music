import { ArtworkEntity } from './artwork.entity'

export interface ArtistArtworkEntity extends ArtworkEntity {
  artistId: string
}
