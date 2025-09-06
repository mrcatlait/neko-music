import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { Reflector } from '@nestjs/core'

import { AuthService, JwtService } from '../services'
import { PERMISSIONS_METADATA_KEY, PUBLIC_METADATA_KEY } from '../decorators'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const req = context.switchToHttp().getRequest<FastifyRequest>()

    const accessToken = this.authService.extractAccessTokenFromHeader(req)

    if (!accessToken) {
      throw new UnauthorizedException()
    }

    try {
      const payload = await this.jwtService.verifyAccessToken(accessToken)
      req.user = {
        id: payload.sub,
        permissions: payload.scopes,
      }
    } catch {
      throw new UnauthorizedException()
    }

    const requiredPermissions = this.reflector.getAllAndOverride<string[] | undefined>(PERMISSIONS_METADATA_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (requiredPermissions?.length) {
      const hasPermission = requiredPermissions.some((permission) => req.user?.permissions.includes(permission))

      if (!hasPermission) {
        throw new ForbiddenException()
      }
    }

    return true
  }
}
