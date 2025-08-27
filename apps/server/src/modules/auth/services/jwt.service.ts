import { Inject, Injectable } from '@nestjs/common'
import { JWTPayload as JoseJwtPayload, jwtVerify, SignJWT } from 'jose'

import { AuthModuleOptions } from '../types'
import { AUTH_MODULE_OPTIONS } from '../tokens'
import { JwtClaims, JwtPayload } from '../interfaces'

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
  private readonly accessTokenExpiresIn: number
  private readonly refreshTokenSecret: Uint8Array
  private readonly refreshTokenExpiresIn: number

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
    const expiresAt = new Date(Date.now() + this.refreshTokenExpiresIn * 1000)

    return new SignJWT()
      .setProtectedHeader({ alg: this.alg })
      .setIssuedAt()
      .setSubject(payload.userId)
      .setExpirationTime(this.refreshTokenExpiresIn)
      .sign(this.refreshTokenSecret)
      .then((token) => ({ token, expiresAt }))
  }

  verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.verify(token, this.refreshTokenSecret)
  }

  async verify(token: string, secret: Uint8Array): Promise<JwtPayload> {
    const { payload } = await jwtVerify(token, secret)
    const timestamp = Math.floor(Date.now() / 1000)

    if (typeof payload.exp !== 'number') {
      throw new Error('invalid exp value')
    }

    if (timestamp >= payload.exp) {
      throw new Error('jwt expired')
    }

    return payload as JwtPayload
  }
}
