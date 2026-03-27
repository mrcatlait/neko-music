import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JSONSchemaType } from 'ajv'
import { FastifyRequest } from 'fastify'

/**
 * Parameter decorator that reads the parsed JSON body and validates it with an AJV schema.
 */
export const ValidatedQuery = createParamDecorator((schema: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<FastifyRequest>()

  return request.query
})
