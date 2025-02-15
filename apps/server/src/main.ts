import { NestFactory, Reflector } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ConfigService } from '@nestjs/config'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { fastifySession } from '@fastify/session'
import { fastifyCookie } from '@fastify/cookie'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from '@modules/app/app.module'
import { EnvironmentVariables } from '@modules/shared/models'

const DAY = 1000 * 60 * 60 * 24

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  const configService = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService)

  const PORT = configService.get('PORT')
  const UI_URL = configService.get('UI_URL')
  const COOKIE_SECRET = configService.get('COOKIE_SECRET')

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  const reflector = app.get(Reflector)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  await app.register(fastifyCookie)
  await app.register(fastifySession, {
    secret: COOKIE_SECRET,
    cookie: { sameSite: 'strict', httpOnly: true, maxAge: DAY * 3 },
  })

  app.enableCors({
    origin: UI_URL,
    credentials: true,
  })

  // const config = new DocumentBuilder()
  //   .setTitle('Neko Music API')
  //   .setDescription('The Neko Music API description')
  //   .setVersion('1.0')
  //   .addBearerAuth()
  //   .build()
  // const document = SwaggerModule.createDocument(app, config)
  // SwaggerModule.setup('api', app, document)

  await app.listen({
    port: PORT,
    host: '0.0.0.0',
  })
}

bootstrap().catch(console.error)
