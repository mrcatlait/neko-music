import { AlbumsDtos } from './albums'
import { ArtistsDtos } from './artists'
import { TracksDtos } from './tracks'
import * as Genres from './genres'

export namespace BackstageDtos {
  export namespace Albums {
    export type CreationRequest = AlbumsDtos.CreationRequest
    export type CreationResponse = AlbumsDtos.CreationResponse
  }
  export namespace Artists {
    export type Artist = ArtistsDtos.Artist
    export type ArtistsResponse = ArtistsDtos.ArtistsResponse
    export type CreationRequest = ArtistsDtos.CreationRequest
    export type CreationResponse = ArtistsDtos.CreationResponse
    export type Statistics = ArtistsDtos.Statistics
    export type StatisticsResponse = ArtistsDtos.StatisticsResponse
    export type UpdateRequest = ArtistsDtos.UpdateRequest
    export type UpdateResponse = ArtistsDtos.UpdateResponse
  }
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
