import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { join } from 'path'
import { ScheduleModule } from '@nestjs/schedule'

import { DatabaseModule } from '../database/database.module'
import { SecurityHeadersMiddleware } from './middlewares'

import { EnvironmentVariables } from '@modules/shared/models'
import { AuthModule } from '@modules/auth/auth.module'
import { UserModule } from '@modules/user/user.module'
import { StreamingModule } from '@modules/streaming/streaming.module'
import { MediaModule } from '@modules/media/media.module'
import { EventBusModule } from '@modules/event-bus'
import { CatalogModule } from '@modules/catalog/catalog.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema:
        process.env['NODE_ENV'] === 'test'
          ? Joi.object({})
          : Joi.object({
              // Application
              PORT: Joi.number().required(),
              NODE_ENV: Joi.string().optional(),
              UI_URL: Joi.string().uri().required(),

              // Database
              DATABASE_HOST: Joi.string().required(),
              DATABASE_PORT: Joi.number().required(),
              DATABASE_USERNAME: Joi.string().required(),
              DATABASE_PASSWORD: Joi.string().required(),
              DATABASE_NAME: Joi.string().required(),

              // Telemetry
              TELEMETRY_SERVICE_NAME: Joi.string().required(),
              TELEMETRY_EXPORTER_URL: Joi.string().required(),

              // Crypto
              SALT_ROUNDS: Joi.number().required(),

              // Authentication
              COOKIE_SECRET: Joi.string().required(),
            } as Record<keyof EnvironmentVariables, Joi.AnySchema>),
    }),
    DatabaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        migrations: join(process.cwd(), 'src', 'migrations'),
        runMigrations: true,
        seeds: join(process.cwd(), 'src', 'seeds'),
        runSeeds: true,
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
      }),
      imports: [ConfigModule],
    }),
    ScheduleModule.forRoot(),
    EventBusModule.forRoot(),
    AuthModule,
    CatalogModule,
    MediaModule,
    UserModule,
    StreamingModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityHeadersMiddleware).forRoutes('*')
  }
}
