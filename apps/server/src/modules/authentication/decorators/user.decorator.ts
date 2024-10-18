import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { UserModel } from '@modules/authorization/models'

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext): UserModel | undefined => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>()
  return request.session.user
})
