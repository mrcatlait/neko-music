import { NestFactory, Reflector } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ConfigService } from '@nestjs/config'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'

import { AppModule } from '@modules/app/app.module'
import { EnvironmentVariables } from '@modules/shared/models'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  const configService = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  const reflector = app.get(Reflector)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  await app.register(await import('@fastify/cookie'))

  await app.listen(configService.get('PORT'))
}

bootstrap().catch(console.error)
