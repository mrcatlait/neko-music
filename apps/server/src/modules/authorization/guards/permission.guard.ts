import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { Permission } from '@neko/permissions'

import { PERMISSIONS_KEY } from '../decorators'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const { session } = context.switchToHttp().getRequest<FastifyRequest>()

    const user = session.get('data')

    if (!user) {
      throw new UnauthorizedException()
    }

    return requiredPermissions.every((permission: string) => user.permissions.includes(permission))
  }
}
