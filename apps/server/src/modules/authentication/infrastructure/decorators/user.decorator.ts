import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext): any | undefined => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>()
  return request.session.get('data')
})
