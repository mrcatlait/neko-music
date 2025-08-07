import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { join } from 'path'
import { ScheduleModule } from '@nestjs/schedule'

import { DatabaseModule } from '../database/database.module'
import { SecurityHeadersMiddleware } from './middlewares'

import { AuthModule } from '@/modules/auth/auth.module'
import { UserModule } from '@/modules/user/user.module'
import { StreamingModule } from '@/modules/streaming/streaming.module'
import { env } from 'src/env'
import { MediaModule } from '@/modules/media/media.module'
import { LocalStorageStrategy } from '@/modules/media/strategies/storage'
import { SharpImageTransformStrategy } from '@/modules/media/strategies/image-transform'
import { SharpImageAnalyzeStrategy } from '@/modules/media/strategies/image-analyze'
import { FfmpegAudioTransformStrategy } from '@/modules/media/strategies/audio-transform'

@Module({
  imports: [
    // ConfigModule.forRoot({
    //   isGlobal: true,
    //   cache: true,
    //   validationSchema:
    //     process.env['NODE_ENV'] === 'test'
    //       ? Joi.object({})
    //       : Joi.object({
    //           // Application
    //           PORT: Joi.number().required(),
    //           NODE_ENV: Joi.string().optional(),
    //           UI_URL: Joi.string().uri().required(),

    //           // Database
    //           DATABASE_HOST: Joi.string().required(),
    //           DATABASE_PORT: Joi.number().required(),
    //           DATABASE_USERNAME: Joi.string().required(),
    //           DATABASE_PASSWORD: Joi.string().required(),
    //           DATABASE_NAME: Joi.string().required(),

    //           // Telemetry
    //           TELEMETRY_SERVICE_NAME: Joi.string().required(),
    //           TELEMETRY_EXPORTER_URL: Joi.string().required(),

    //           // Crypto
    //           SALT_ROUNDS: Joi.number().required(),

    //           // Authentication
    //           COOKIE_SECRET: Joi.string().required(),
    //         } as Record<keyof EnvironmentVariables, Joi.AnySchema>),
    // }),
    DatabaseModule.forRoot({
      migrations: join(process.cwd(), 'src', 'migrations'),
      runMigrations: true,
      seeds: join(process.cwd(), 'src', 'seeds'),
      runSeeds: true,
      host: env.DATABASE_HOST,
      port: env.DATABASE_PORT,
      username: env.DATABASE_USERNAME,
      password: env.DATABASE_PASSWORD,
      database: env.DATABASE_NAME,
    }),
    ScheduleModule.forRoot(),
    // EventBusModule.forRoot(),
    AuthModule,
    // CatalogModule,
    MediaModule.forRoot({
      storageStrategy: new LocalStorageStrategy({
        directory: join(process.cwd(), 'media'),
      }),
      imageTransformStrategy: new SharpImageTransformStrategy(),
      imageAnalyzeStrategy: new SharpImageAnalyzeStrategy(),
      audioTransformStrategy: new FfmpegAudioTransformStrategy({
        bitrate: ['128k', '256k'],
        channels: 2,
        sampleRate: 44100,
        codec: 'aac',
        segmentDuration: 10,
      }),
    }),
    UserModule,
    StreamingModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityHeadersMiddleware).forRoutes('*')
  }
}
