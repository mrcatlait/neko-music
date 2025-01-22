import { JWTPayload, jwtVerify, SignJWT } from 'jose'

import { JwtPayload } from '../models'

interface JwtStrategyOptions {
  secret: string
  expiresIn: string
  issuer: string
  audience: string
}

export class BaseJwtStrategy<Payload extends JWTPayload = JWTPayload> {
  private readonly alg = 'HS256'

  private readonly secret: Uint8Array
  private readonly expiresIn: string
  private readonly issuer: string
  private readonly audience: string

  constructor(options: JwtStrategyOptions) {
    this.secret = new TextEncoder().encode(options.secret)
    this.expiresIn = options.expiresIn
    this.issuer = options.issuer
    this.audience = options.audience
  }

  verify(token: string | null): Promise<JwtPayload | null> {
    if (!token) {
      return Promise.resolve(null)
    }

    return jwtVerify(token, this.secret, {
      issuer: this.issuer,
      audience: this.audience,
    })
      .then((result) => result.payload as JwtPayload)
      .catch(() => null)
  }

  sign(payload: Payload): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: this.alg })
      .setIssuedAt()
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setExpirationTime(this.expiresIn)
      .sign(this.secret)
  }
}
