import { NestFactory, Reflector } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { fastifyCookie } from '@fastify/cookie'
import { fastifyMultipart } from '@fastify/multipart'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { ConfigService } from './modules/config/services'

import { AppModule } from '@/modules/app/app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  const configService = app.get(ConfigService)

  const PORT = configService.config.PORT
  const UI_URL = configService.config.UI_URL

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  const reflector = app.get(Reflector)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  await app.register(fastifyCookie)
  await app.register(fastifyMultipart)

  app.enableCors({
    origin: UI_URL,
    credentials: true,
  })

  const config = new DocumentBuilder()
    .setTitle('Neko Music API')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
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
