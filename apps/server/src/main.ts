import './polyfill'

import { NestFactory, Reflector } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { fastify } from 'fastify'
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common'
import { fastifyCookie } from '@fastify/cookie'

import { AppModule } from './app.module'
import { setupLogger } from './util/setup-logger.util'
import { ConfigService } from './core/services'
import { setupSwagger } from './util'

import { NODE_ENV } from '@core/models'

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

  await app.register(fastifyCookie, {
    secret: COOKIE_SECRET,
  })

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

  await app.listen(PORT, '0.0.0.0')

  logger.log(`Server started on ${PORT}`)
}

bootstrap().catch((error) => {
  new Logger().error(error.message, error)
  process.exit(1)
})
