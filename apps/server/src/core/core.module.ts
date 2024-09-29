import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'path'
import { FastifyMulterModule } from '@nest-lab/fastify-multer'
import { APP_GUARD } from '@nestjs/core'

import { ConfigService, ImageProcessingService, VideoProcessingService } from './services'
import { NODE_ENV } from './models'
import { RolesGuard } from './guards'
import { TypeOrmSeedModule } from './seed/typeorm-seed.module'

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
          migrations: [join(__dirname + '/../' + 'migrations/*{.ts,.js}')],
          logging: configService.get('NODE_ENV') === NODE_ENV.DEVELOPMENT,
        }
      },
      inject: [ConfigService],
    }),
    TypeOrmSeedModule.forRootAsync({
      useFactory(configService: ConfigService) {
        return {
          seedsRun: configService.get('NODE_ENV') === NODE_ENV.DEVELOPMENT,
          seeds: [join(__dirname + '/../' + 'seeds/*{.ts,.js}')],
        }
      },
      inject: [ConfigService],
    }),
    FastifyMulterModule,
  ],
  providers: [
    ConfigService,
    ImageProcessingService,
    VideoProcessingService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [ConfigService, ImageProcessingService, VideoProcessingService],
})
export class CoreModule {}
