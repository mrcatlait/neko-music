import {
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
  RegistrationRequestDto,
  WhoamiResponseDto,
} from './auth'
import {
  ArtistCreationRequestDto,
  ArtistDto,
  ArtistsResponseDto,
  ArtistUpdateRequestDto,
  GenreCreationRequestDto,
  GenreDto,
  GenresResponseDto,
  GenreUpdateRequestDto,
} from './backstage'
import { BadRequestDto } from './error'
import { UploadTokenResponseDto } from './media'
import { ArtworkDto } from './shared'

export namespace Contracts {
  export namespace Auth {
    export type LoginRequest = LoginRequestDto
    export type LoginResponse = LoginResponseDto
    export type RefreshTokenResponse = RefreshTokenResponseDto
    export type RegistrationRequest = RegistrationRequestDto
    export type WhoamiResponse = WhoamiResponseDto
  }

  export namespace Backstage {
    // Genres
    export type GenreCreationRequest = GenreCreationRequestDto
    export type GenreUpdateRequest = GenreUpdateRequestDto
    export type Genre = GenreDto
    export type GenresResponse = GenresResponseDto
    // Artists
    export type ArtistCreationRequest = ArtistCreationRequestDto
    export type ArtistUpdateRequest = ArtistUpdateRequestDto
    export type ArtistsResponse = ArtistsResponseDto
    export type Artist = ArtistDto
  }

  export namespace Media {
    export type UploadTokenResponse = UploadTokenResponseDto
  }

  export namespace Error {
    export type BadRequest = BadRequestDto
  }

  export namespace Shared {
    export type Artwork = ArtworkDto
  }
}
