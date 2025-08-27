import { JWTPayload } from 'jose'

import { JwtClaims } from './jwt-claims.interface'

export type JwtPayload = JWTPayload &
  JwtClaims & {
    sub: string
  }
