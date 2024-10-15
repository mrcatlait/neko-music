import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'

import { IS_PUBLIC_KEY } from '../../authentication/decorators/public.decorator'
import { Permission } from '../constants'
import { PERMISSIONS_KEY } from '../decorators'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<Permission[] | undefined>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const { user } = context.switchToHttp().getRequest<FastifyRequest>()

    if (!requiredPermissions) {
      return true
    }

    return requiredPermissions.some((permission) => (user as any)?.permissions.includes(permission))
  }
}
