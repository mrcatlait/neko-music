import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { User } from '../interfaces'

export const Session = createParamDecorator((data: unknown, ctx: ExecutionContext): User | undefined => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>()
  return request.user
})
