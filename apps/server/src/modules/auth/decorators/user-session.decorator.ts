import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql'

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
  if (ctx.getType() === 'http') {
    return ctx.switchToHttp().getRequest<FastifyRequest>().user
  } else if (ctx.getType<GqlContextType>() === 'graphql') {
    return GqlExecutionContext.create(ctx).getContext<{ req: FastifyRequest }>().req.user
  } else {
    throw new UnauthorizedException()
  }
})
