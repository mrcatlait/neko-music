import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { AuthService, JwtService } from '../services'

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>()

    const refreshToken = this.authService.extractRefreshTokenFromCookie(request)

    if (!refreshToken) {
      throw new UnauthorizedException()
    }

    try {
      await this.jwtService.verifyRefreshToken(refreshToken)
    } catch {
      throw new UnauthorizedException()
    }

    return true
  }
}
