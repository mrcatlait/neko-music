import { AlbumsDtos } from './albums'
import { ArtistsDtos } from './artists'
import { GenresDtos } from './genres'
import { TracksDtos } from './tracks'

export namespace BackstageDtos {
  export import Albums = AlbumsDtos
  export import Artists = ArtistsDtos
  export import Genres = GenresDtos
  export import Tracks = TracksDtos
}
