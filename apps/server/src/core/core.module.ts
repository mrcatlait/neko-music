import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'path'
import { FastifyMulterModule } from '@nest-lab/fastify-multer'
import { APP_GUARD } from '@nestjs/core'

import { ConfigService, DatabaseSeedService, ImageProcessingService, VideoProcessingService } from './services'
import { NODE_ENV } from './models'
import { RolesGuard } from './guards'
import { CreateArtists1000000000020, CreateGenres1000000000010 } from '../seeds'

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
    FastifyMulterModule,
  ],
  providers: [
    ConfigService,
    ImageProcessingService,
    VideoProcessingService,
    DatabaseSeedService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [ConfigService, ImageProcessingService, VideoProcessingService],
})
export class CoreModule {
  constructor(private readonly databaseSeedService: DatabaseSeedService) {
    this.databaseSeedService.executePendingSeeds([CreateGenres1000000000010, CreateArtists1000000000020])
  }
}
