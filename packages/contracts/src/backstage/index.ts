import { AlbumsDtos } from './albums'
import { TracksDtos } from './tracks'
import * as Artists from './artists'
import * as Genres from './genres'

export namespace BackstageDtos {
  export namespace Albums {
    export type CreationRequest = AlbumsDtos.CreationRequest
    export type CreationResponse = AlbumsDtos.CreationResponse
  }
  // Artists
  export type ArtistCreationRequest = Artists.ArtistCreationRequest
  export type ArtistListResponse = Artists.ArtistListResponse
  export type ArtistResponse = Artists.ArtistResponse
  export type ArtistUpdateRequest = Artists.ArtistUpdateRequest
  export type Artist = Artists.Artist

  // Genres
  export type GenreCreationRequest = Genres.GenreCreationRequest
  export type GenreListResponse = Genres.GenreListResponse
  export type GenreResponse = Genres.GenreResponse
  export type GenreUpdateRequest = Genres.GenreUpdateRequest
  export type Genre = Genres.Genre

  export namespace Tracks {
    export type CreationRequest = TracksDtos.CreationRequest
    export type CreationResponse = TracksDtos.CreationResponse
  }
}
