import {
  LoginRequestDto,
  LoginResponseDto,
  RefreshTokenResponseDto,
  RegistrationRequestDto,
  WhoamiResponseDto,
} from './auth'
import { BadRequestDto } from './error'

export namespace Contracts {
  export namespace Auth {
    export type LoginRequest = LoginRequestDto
    export type LoginResponse = LoginResponseDto
    export type RefreshTokenResponse = RefreshTokenResponseDto
    export type RegistrationRequest = RegistrationRequestDto
    export type WhoamiResponse = WhoamiResponseDto
  }

  export namespace Error {
    export type BadRequest = BadRequestDto
  }
}
