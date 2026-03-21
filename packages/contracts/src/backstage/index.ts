import { AlbumsDtos } from './albums'
import { ArtistsDtos } from './artists'
import { GenresDtos } from './genres'
import { TracksDtos } from './tracks'

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
  export namespace Genres {
    export type CreationRequest = GenresDtos.CreationRequest
    export type CreationResponse = GenresDtos.CreationResponse
    export type Genre = GenresDtos.Genre
    export type GenresResponse = GenresDtos.GenresResponse
    export type Statistics = GenresDtos.Statistics
    export type StatisticsResponse = GenresDtos.StatisticsResponse
    export type UpdateRequest = GenresDtos.UpdateRequest
  }
  export namespace Tracks {
    export type CreationRequest = TracksDtos.CreationRequest
    export type CreationResponse = TracksDtos.CreationResponse
  }
}
