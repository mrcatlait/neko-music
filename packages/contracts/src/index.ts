import {
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
  RegistrationRequestDto,
  WhoamiResponseDto,
} from './auth'
import {
  ArtistCreationRequestDto,
  ArtistCreationResponseDto,
  ArtistDto,
  ArtistsResponseDto,
  ArtistUpdateRequestDto,
  GenreCreationRequestDto,
  GenreCreationResponseDto,
  GenreDto,
  GenresResponseDto,
  GenreUpdateRequestDto,
} from './backstage'
import { BadRequestDto } from './error'
import { UploadMediaResponseDto, UploadTokenResponseDto } from './media'
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
    export type GenreCreationResponse = GenreCreationResponseDto
    export type GenreUpdateRequest = GenreUpdateRequestDto
    export type Genre = GenreDto
    export type GenresResponse = GenresResponseDto
    // Artists
    export type ArtistCreationRequest = ArtistCreationRequestDto
    export type ArtistCreationResponse = ArtistCreationResponseDto
    export type ArtistUpdateRequest = ArtistUpdateRequestDto
    export type ArtistsResponse = ArtistsResponseDto
    export type Artist = ArtistDto
  }

  export namespace Media {
    export type UploadTokenResponse = UploadTokenResponseDto
    export type UploadMediaResponse = UploadMediaResponseDto
  }

  export namespace Error {
    export type BadRequest = BadRequestDto
  }

  export namespace Shared {
    export type Artwork = ArtworkDto
  }
}
