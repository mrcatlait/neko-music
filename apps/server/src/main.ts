import './polyfill'

import { NestFactory, Reflector } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { fastify } from 'fastify'
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common'
import { fastifyCookie } from '@fastify/cookie'
import { fastifySession } from '@fastify/session'

import { setupLogger } from './util/setup-logger.util'
import { setupSwagger } from './util'

import { ConfigService } from '@shared/services'
import { AppModule } from '@modules/app'
import { NODE_ENV } from '@common/constants'

async function bootstrap() {
  const logger = new Logger()

  const instance = fastify({
    logger: {
      level: 'warn',
    },
    disableRequestLogging: true,
  })

  setupLogger(instance)

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(instance))

  const configService = app.get(ConfigService)

  const PORT = configService.get('PORT')
  const UI_URL = configService.get('UI_URL')

  const COOKIE_SECRET = configService.get('COOKIE_SECRET')

  await app.register(fastifyCookie)

  await app.register(fastifySession, { secret: COOKIE_SECRET })

  if (configService.get('NODE_ENV') === NODE_ENV.DEVELOPMENT) {
    setupSwagger(app)
  }

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  const reflector = app.get(Reflector)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  app.enableCors({
    origin: UI_URL,
    credentials: true,
  })

  await app.listen({
    port: PORT,
    host: '0.0.0.0',
  })

  logger.log(`Server started on ${PORT}`)
}

bootstrap().catch((error) => {
  if (error instanceof Error) {
    new Logger().error(error.message, error)
  }

  process.exit(1)
})
