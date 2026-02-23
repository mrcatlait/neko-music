import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { User } from '../interfaces'

/**
 * Decorator to inject the user session into the request object
 *
 * @example
 * ```ts
 * \@Get()
 * getUser(@UserSession() user: User): Promise<User> {
 *   return this.userService.getUser(user.id)
 * }
 * ```
 */
export const UserSession = createParamDecorator((data: unknown, ctx: ExecutionContext): User | undefined => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>()
  return request.user
})
