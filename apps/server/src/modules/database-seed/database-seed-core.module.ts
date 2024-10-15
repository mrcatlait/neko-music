import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { getDataSourceToken } from '@nestjs/typeorm'

import { DatabaseSeedService } from './database-seed.service'
import { TypeOrmSeedModuleAsyncOptions, TypeOrmSeedModuleOptions, TypeOrmSeedOptionsFactory } from './types'

export const TYPEORM_SEED_MODULE_OPTIONS = 'TypeOrmSeedModuleOptions'

@Global()
@Module({})
export class DatabaseSeedCoreModule {
  static forRoot(options: TypeOrmSeedModuleOptions = {}): DynamicModule {
    const typeOrmSeedModuleOptions: Provider = {
      provide: TYPEORM_SEED_MODULE_OPTIONS,
      useValue: options,
    }

    const databaseSeedProvider: Provider = {
      provide: DatabaseSeedService,
      useFactory: (dataSource: DataSource) => this.databaseSeedFactory(dataSource, options),
      inject: [getDataSourceToken()],
    }

    const providers: Provider[] = [typeOrmSeedModuleOptions, databaseSeedProvider]

    return {
      module: DatabaseSeedCoreModule,
      providers,
    }
  }

  static forRootAsync(options: TypeOrmSeedModuleAsyncOptions): DynamicModule {
    const databaseSeedProvider: Provider = {
      provide: DatabaseSeedService,
      useFactory: (dataSource: DataSource, typeOrmSeedOptions: TypeOrmSeedModuleOptions) =>
        this.databaseSeedFactory(dataSource, typeOrmSeedOptions),
      inject: [getDataSourceToken(), TYPEORM_SEED_MODULE_OPTIONS],
    }

    const asyncProviders = this.createAsyncProviders(options)

    const providers: Provider[] = [...asyncProviders, databaseSeedProvider, ...(options.extraProviders || [])]

    return {
      module: DatabaseSeedCoreModule,
      imports: options.imports,
      providers,
    }
  }

  private static createAsyncProviders(options: TypeOrmSeedModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }

    const useClass = options.useClass as Type<TypeOrmSeedOptionsFactory>

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ]
  }

  private static createAsyncOptionsProvider(options: TypeOrmSeedModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: TYPEORM_SEED_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    const inject = [(options.useClass || options.useExisting) as Type<TypeOrmSeedOptionsFactory>]

    return {
      provide: TYPEORM_SEED_MODULE_OPTIONS,
      useFactory: (optionsFactory: TypeOrmSeedOptionsFactory) => optionsFactory.createOptions(),
      inject,
    }
  }

  private static async databaseSeedFactory(
    dataSource: DataSource,
    options: TypeOrmSeedModuleOptions,
  ): Promise<DatabaseSeedService> {
    const databaseSeedService = new DatabaseSeedService(dataSource, options)

    if (options.seedsRun) {
      await databaseSeedService.executePendingSeeds()
    }

    return databaseSeedService
  }
}
