import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { RefreshTokenJwtStrategy } from '@modules/authentication/shared/jwt'
import { REFRESH_TOKEN_COOKIE_NAME } from '@modules/authentication/shared/constants'
import { JwtPayload } from '@modules/authentication/shared/models'

@Injectable()
export class JwtRefreshAuthGuard implements CanActivate {
  constructor(private readonly refreshTokenJwtStrategy: RefreshTokenJwtStrategy) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const token = request.cookies[REFRESH_TOKEN_COOKIE_NAME]

    const payload = await this.refreshTokenJwtStrategy.verify(token)
    request.payload = payload ?? ({} as JwtPayload)
    return Boolean(payload)
  }
}
