import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { TestingModule } from '@nestjs/testing'
import { fastifyCookie } from '@fastify/cookie'
import { fastifySession } from '@fastify/session'
import { fastify } from 'fastify'

export async function createTestApp(moduleRef: TestingModule): Promise<NestFastifyApplication> {
  const instance = fastify({
    logger: {
      level: 'warn',
    },
    disableRequestLogging: true,
  })

  const app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter(instance))

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  const reflector = app.get(Reflector)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  await app.register(fastifyCookie)
  await app.register(fastifySession, {
    secret: '1234567890asdfghjklz1234567890as',
  })

  return app
}
