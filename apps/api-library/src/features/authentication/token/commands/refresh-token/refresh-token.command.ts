import { JwtPayload } from '@features/authentication/shared/models'

export interface RefreshTokenCommand {
  token: string
  jwtPayload: JwtPayload
}
