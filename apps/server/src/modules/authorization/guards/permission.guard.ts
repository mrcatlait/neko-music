import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { getPermissionId, Permission } from '@neko/permissions'

import { IS_PUBLIC_KEY } from '../../authentication/decorators/public.decorator'
import { PERMISSIONS_KEY } from '../decorators'
import { RolePermissions } from '../constants'

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) {
      return true
    }

    const requiredPermissions = this.reflector.getAllAndOverride<Permission[] | undefined>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (!requiredPermissions) {
      return true
    }

    const { session } = context.switchToHttp().getRequest<FastifyRequest>()

    const user = session.user

    if (!user) {
      return requiredPermissions.some((permission) => RolePermissions.guest.includes(permission))
    }

    const formattedPermissions = requiredPermissions.map((permission) => getPermissionId(permission))

    return formattedPermissions.some((permission) => user.permissions.includes(permission))
  }
}
