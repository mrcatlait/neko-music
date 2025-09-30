import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { join } from 'path'
import { ScheduleModule } from '@nestjs/schedule'
import { APP_GUARD } from '@nestjs/core'

import { SecurityHeadersMiddleware } from './middlewares'
import { BackstageModule } from '../backstage/backstage.module'

import { AuthGuard } from '@/modules/auth/guards'
import { DatabaseModule } from '@/modules/database/database.module'
import { EventBusModule, ObservableMessagingStrategy } from '@/modules/event-bus'
import { CatalogModule } from '@/modules/catalog/catalog.module'
import { ConfigService } from '@/modules/config/services'
import { ConfigModule } from '@/modules/config/config.module'
import { UserModule } from '@/modules/user/user.module'
import { MediaModule } from '@/modules/media/media.module'
import {
  LocalStorageStrategy,
  SharpImageTransformStrategy,
  SharpImageAnalyzeStrategy,
  FfmpegAudioTransformStrategy,
  DefaultNamingStrategy,
} from '@/modules/media/strategies'
import { AuthModule } from '@/modules/auth/auth.module'

@Module({
  imports: [
    ConfigModule.forRoot({}),
    DatabaseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        migrations: join(process.cwd(), 'src', 'migrations'),
        runMigrations: true,
        seeds: join(process.cwd(), 'src', 'seeds'),
        runSeeds: true,
        host: configService.config.DATABASE_HOST,
        port: configService.config.DATABASE_PORT,
        username: configService.config.DATABASE_USERNAME,
        password: configService.config.DATABASE_PASSWORD,
        database: configService.config.DATABASE_NAME,
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    EventBusModule.forRoot({
      messagingStrategy: new ObservableMessagingStrategy(),
    }),
    AuthModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        accessTokenSecret: configService.config.JWT_ACCESS_TOKEN_SECRET,
        accessTokenExpiresIn: configService.config.JWT_ACCESS_TOKEN_EXPIRES_IN,
        refreshTokenSecret: configService.config.JWT_REFRESH_TOKEN_SECRET,
        refreshTokenExpiresIn: configService.config.JWT_REFRESH_TOKEN_EXPIRES_IN,
        refreshTokenCookieName: configService.config.JWT_REFRESH_TOKEN_COOKIE_NAME,
      }),
      inject: [ConfigService],
    }),
    BackstageModule.forRoot({}),
    CatalogModule,
    MediaModule.forRoot({
      storageStrategy: new LocalStorageStrategy({
        directory: join(process.cwd(), 'media'),
      }),
      imageTransformStrategy: new SharpImageTransformStrategy(),
      imageTransformPresets: [
        {
          width: 56,
          height: 56,
          format: 'webp',
          mode: 'cover',
        },
        {
          width: 256,
          height: 256,
          format: 'webp',
          mode: 'cover',
        },
        {
          width: 720,
          height: 720,
          format: 'webp',
          mode: 'cover',
        },
      ],
      imageAnalyzeStrategy: new SharpImageAnalyzeStrategy(),
      audioTransformStrategy: new FfmpegAudioTransformStrategy(),
      audioTransformPreset: {
        bitrate: ['128k', '256k'],
        channels: 2,
        sampleRate: 44100,
        codec: 'aac',
        segmentDuration: 10,
      },
      namingStrategy: new DefaultNamingStrategy(),
      temporaryDirectory: join(process.cwd(), 'temp'),
      allowedImageMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxImageSize: 10485760, // 10MB
    }),
    UserModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityHeadersMiddleware).forRoutes('*')
  }
}
