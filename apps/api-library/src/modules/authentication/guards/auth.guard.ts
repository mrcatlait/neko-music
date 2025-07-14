import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { Observable } from 'rxjs'

import { IS_PUBLIC_KEY } from '../decorators'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    return true

    if (isPublic) {
      return true
    }

    const req = context.switchToHttp().getRequest<FastifyRequest>()

    if (!req.session.get('data')) {
      throw new UnauthorizedException()
    }

    return true
  }
}
