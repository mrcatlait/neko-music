import { NestFactory, Reflector } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { fastifySession } from '@fastify/session'
import { fastifyCookie } from '@fastify/cookie'
import { fastifyMultipart } from '@fastify/multipart'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { env } from 'process'

import { AppModule } from '@modules/app/app.module'

const DAY = 1000 * 60 * 60 * 24

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  const PORT = env.PORT
  const UI_URL = env.UI_URL
  const COOKIE_SECRET = env.COOKIE_SECRET

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
    cookie: { sameSite: 'strict', httpOnly: true, maxAge: DAY * 3, secure: true, path: '/' },
  })
  await app.register(fastifyMultipart)

  app.enableCors({
    origin: UI_URL,
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('Neko Music API')
    .setVersion('1.0')
    .addCookieAuth()
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error',
    })
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  await app.listen({
    port: PORT,
    host: '0.0.0.0',
  })
}

bootstrap().catch(console.error)
