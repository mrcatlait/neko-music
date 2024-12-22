// import '@modules/telemetry/telemetry'
import { NestFactory, Reflector } from '@nestjs/core'
import { ValidationPipe, ClassSerializerInterceptor, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from '@modules/app/app.module'
import { EnvironmentVariables } from '@modules/shared/models'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService)

  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  const reflector = app.get(Reflector)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  const config = new DocumentBuilder().setTitle('API').build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  await app.listen(configService.get('PORT'))
}

bootstrap().catch((error) => {
  if (error instanceof Error) {
    new Logger().error(error.message, error)
  }

  process.exit(1)
})
