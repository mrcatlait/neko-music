import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import * as Joi from 'joi'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { join } from 'path'

import { SecurityHeadersMiddleware } from './middlewares'

import { DatabaseModule } from '@modules/database/database.module'
import { EnvironmentVariables } from '@modules/shared/models'
import { ArtistModule } from '@modules/artist/artist.module'
import { TrackModule } from '@modules/track/track.module'
import { PlaylistModule } from '@modules/playlist/playlist.module'
import { SharedModule } from '@modules/shared/shared.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // cache: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        NODE_ENV: Joi.string().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_USERNAME: Joi.string().required(),
        DATABASE_PASSWORD: Joi.string().required(),
        DATABASE_NAME: Joi.string().required(),
        TELEMETRY_SERVICE_NAME: Joi.string().required(),
        TELEMETRY_EXPORTER_URL: Joi.string().required(),
        SALT_ROUNDS: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
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
    ArtistModule,
    TrackModule,
    PlaylistModule,
    SharedModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityHeadersMiddleware).forRoutes('*')
  }
}
