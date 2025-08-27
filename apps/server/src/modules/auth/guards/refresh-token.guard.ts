import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { AuthService } from '../services'

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const token = this.authService.extractRefreshTokenFromCookie(request)

    return Boolean(token)
  }
}
