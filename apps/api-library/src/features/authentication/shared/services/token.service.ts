import { TokenPair } from '../models'

import { AuthTokenJwtStrategy, RefreshTokenJwtStrategy } from '@features/authentication/shared/jwt'
import { Container } from '@common/di'

export class TokenService {
  private readonly authTokenJwtStrategy: AuthTokenJwtStrategy
  private readonly refreshTokenJwtStrategy: RefreshTokenJwtStrategy

  constructor() {
    this.authTokenJwtStrategy = Container.get(AuthTokenJwtStrategy)
    this.refreshTokenJwtStrategy = Container.get(RefreshTokenJwtStrategy)
  }

  async createTokenPair(userId: string): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.authTokenJwtStrategy.sign({
        sub: userId,
      }),
      this.refreshTokenJwtStrategy.sign({
        sub: userId,
      }),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }
}
