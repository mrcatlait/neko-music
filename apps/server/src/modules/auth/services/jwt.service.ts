import { Inject, Injectable } from '@nestjs/common'
import { JWTPayload as JoseJwtPayload, jwtVerify, SignJWT } from 'jose'
import { randomUUID } from 'crypto'

import { AuthModuleOptions } from '../types'
import { AUTH_MODULE_OPTIONS } from '../tokens'
import { JwtClaims, JwtPayload } from '../interfaces'

import { parseTimePeriod } from '@/modules/shared/utils'

export interface AccessTokenPayload extends JwtClaims {
  userId: string
}

interface RefreshTokenPayload {
  userId: string
}

interface SignRefreshTokenResult {
  token: string
  expiresAt: Date
}

@Injectable()
export class JwtService {
  private readonly accessTokenSecret: Uint8Array
  private readonly accessTokenExpiresIn: string
  private readonly refreshTokenSecret: Uint8Array
  private readonly refreshTokenExpiresIn: string

  private readonly alg = 'HS256'

  constructor(@Inject(AUTH_MODULE_OPTIONS) private readonly options: AuthModuleOptions) {
    this.accessTokenSecret = new TextEncoder().encode(options.accessTokenSecret)
    this.accessTokenExpiresIn = options.accessTokenExpiresIn
    this.refreshTokenSecret = new TextEncoder().encode(options.refreshTokenSecret)
    this.refreshTokenExpiresIn = options.refreshTokenExpiresIn
  }

  signAccessToken(payload: AccessTokenPayload): Promise<string> {
    const claims: JoseJwtPayload = {
      scopes: payload.scopes,
    }

    return new SignJWT(claims as unknown as JoseJwtPayload)
      .setProtectedHeader({ alg: this.alg })
      .setIssuedAt()
      .setSubject(payload.userId)
      .setExpirationTime(this.accessTokenExpiresIn)
      .sign(this.accessTokenSecret)
  }

  verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.verify(token, this.accessTokenSecret)
  }

  signRefreshToken(payload: RefreshTokenPayload): Promise<SignRefreshTokenResult> {
    const expiresAt = new Date(Date.now() + parseTimePeriod(this.refreshTokenExpiresIn) * 1000)

    return new SignJWT()
      .setProtectedHeader({ alg: this.alg })
      .setIssuedAt()
      .setSubject(payload.userId)
      .setJti(randomUUID())
      .setExpirationTime(this.refreshTokenExpiresIn)
      .sign(this.refreshTokenSecret)
      .then((token) => ({ token, expiresAt }))
  }

  verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.verify(token, this.refreshTokenSecret)
  }

  verify(token: string, secret: Uint8Array): Promise<JwtPayload> {
    return jwtVerify(token, secret).then(({ payload }) => payload as JwtPayload)
  }
}
