import { AlbumEntity } from './album.entity'
import { ArtistEntity } from './artist.entity'

export interface AlbumWithArtistsEntity extends AlbumEntity {
  artists: ArtistEntity[]
}
