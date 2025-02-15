import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'

import { UserSession } from '@modules/authentication/shared/interfaces'

export const Session = createParamDecorator((data: unknown, ctx: ExecutionContext): UserSession | undefined => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>()
  return request.session.get('data')
})
