import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FastifyMulterModule } from '@nest-lab/fastify-multer'
import { APP_GUARD } from '@nestjs/core'
import { ScheduleModule } from '@nestjs/schedule'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

import { ConfigService, ImageProcessingService, VideoProcessingService } from './services'
import { NODE_ENV } from './models'
import { TypeOrmSeedModule } from './seed/typeorm-seed.module'

import { migrations } from 'src/migrations'
import { seeds } from 'src/seeds'
import { JwtAuthGuard } from '@features/auth/guards'

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          type: 'postgres',
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          migrationsRun: true,
          synchronize: false,
          autoLoadEntities: true,
          migrations: migrations,
          logging: configService.get('NODE_ENV') === NODE_ENV.DEVELOPMENT,
        }
      },
      inject: [ConfigService],
    }),
    TypeOrmSeedModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          seedsRun: configService.get('NODE_ENV') !== NODE_ENV.PRODUCTION,
          seeds: seeds,
        }
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 1000,
      },
    ]),
    FastifyMulterModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    ConfigService,
    ImageProcessingService,
    VideoProcessingService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [ConfigService, ImageProcessingService, VideoProcessingService],
})
export class CoreModule {}
