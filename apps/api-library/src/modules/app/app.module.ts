import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Joi from 'joi'
import { join } from 'path'

import { SecurityHeadersMiddleware } from './middlewares'
import { DatabaseModule } from '../database/database.module'

import { EnvironmentVariables } from '@modules/shared/models'
import { AuthenticationModule } from '@modules/authentication/authentication.module'
import { AuthorizationModule } from '@modules/authorization/authorization.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema:
        process.env.NODE_ENV === 'test'
          ? Joi.object({})
          : Joi.object({
              // Application
              PORT: Joi.number().required(),
              NODE_ENV: Joi.string().optional(),

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

              // JWT
              JWT_SECRET: Joi.string().required(),
              JWT_TOKEN_EXPIRATION_TIME: Joi.string().required(),
              JWT_REFRESH_SECRET: Joi.string().required(),
              JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
              JWT_ISSUER: Joi.string().required(),
              JWT_AUDIENCE: Joi.string().required(),
            } as Record<keyof EnvironmentVariables, Joi.AnySchema>),
    }),
    DatabaseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        migrations: join(process.cwd(), 'src', 'migrations'),
        migrationsRun: true,
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
      }),
      imports: [ConfigModule],
    }),
    AuthenticationModule,
    AuthorizationModule,
    // ArtistModule,
    // TrackModule,
    // PlaylistModule,
    // SharedModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityHeadersMiddleware).forRoutes('*')
  }
}
