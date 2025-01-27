import { Injectable } from '@nestjs/common'

import { AuthTokenJwtStrategy, RefreshTokenJwtStrategy } from '../jwt'
import { TokenPair } from '../models'

@Injectable()
export class TokenService {
  constructor(
    private readonly authTokenJwtStrategy: AuthTokenJwtStrategy,
    private readonly refreshTokenJwtStrategy: RefreshTokenJwtStrategy,
  ) {}

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
