import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FastifyMulterModule } from '@nest-lab/fastify-multer'

import { migrations } from '../../migrations'
import { seeds } from '../../seeds'
import { AuthenticationModule } from '../authentication'
import { AuthorizationModule } from '../authorization'
import { DatabaseSeedModule } from '../database-seed'
import { SharedModule } from '../shared'

import { ConfigService } from '@shared/services'
import { ArtistModule } from '@modules/artist'
import { TrackModule } from '@modules/track'
import { NODE_ENV } from '@common/constants'
import { PlaylistModule } from '@modules/playlist'
import { AuthGuard } from '@modules/authentication/guards'
import { UserModule } from '@modules/user'

@Module({
  imports: [
    SharedModule,
    AuthenticationModule,
    AuthorizationModule,
    FastifyMulterModule,
    ArtistModule,
    TrackModule,
    PlaylistModule,
    UserModule,
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
    DatabaseSeedModule.forRootAsync({
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
    ScheduleModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
