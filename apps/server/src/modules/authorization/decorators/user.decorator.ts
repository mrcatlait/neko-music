import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { CustomParamFactory } from '@nestjs/common/interfaces'

import { UserModel } from '@modules/authorization/models'

export const UserDecoratorFactory: CustomParamFactory = (
  data: unknown,
  ctx: ExecutionContext,
): UserModel | undefined => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>()
  return request.session.get('data')
}

export const User = createParamDecorator(UserDecoratorFactory)
