import { LoginRequestDto } from './login-request.dto'
import { LoginResponseDto } from './login-response.dto'
import { RefreshTokenResponseDto } from './refresh-token-response.dto'
import { RegistrationRequestDto } from './registration-request.dto'
import { WhoamiResponseDto } from './whoami-response.dto'

export namespace AuthDtos {
  export type LoginRequest = LoginRequestDto
  export type LoginResponse = LoginResponseDto
  export type RefreshTokenResponse = RefreshTokenResponseDto
  export type RegistrationRequest = RegistrationRequestDto
  export type WhoamiResponse = WhoamiResponseDto
}
