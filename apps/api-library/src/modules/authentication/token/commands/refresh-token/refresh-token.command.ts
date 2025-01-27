import { JwtPayload } from '../../../shared/models'

export interface RefreshTokenCommand {
  token: string
  jwtPayload: JwtPayload
}
