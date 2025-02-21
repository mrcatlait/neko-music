import { DynamicModule, Global, Module, Provider, Type } from '@nestjs/common'

import { DatabaseModuleAsyncOptions, DatabaseModuleOptions, DatabaseOptionsFactory } from './types'
import { DatabaseMigrationService, DatabaseService } from './services'
import { DATABASE_MODULE_OPTIONS } from './database.tokens'

@Global()
@Module({})
export class DatabaseCoreModule {
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    const databaseModuleOptions: Provider = {
      provide: DATABASE_MODULE_OPTIONS,
      useValue: options,
    }

    const providers: Provider[] = [databaseModuleOptions, DatabaseMigrationService, DatabaseService]

    return {
      module: DatabaseCoreModule,
      providers,
      exports: [DatabaseService],
    }
  }

  static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options)

    const providers: Provider[] = [
      ...asyncProviders,
      DatabaseMigrationService,
      DatabaseService,
      ...(options.extraProviders || []),
    ]

    return {
      module: DatabaseCoreModule,
      imports: options.imports,
      providers,
      exports: [DatabaseService],
    }
  }

  private static createAsyncProviders(options: DatabaseModuleAsyncOptions): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)]
    }

    const useClass = options.useClass as Type<DatabaseOptionsFactory>

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ]
  }

  private static createAsyncOptionsProvider(options: DatabaseModuleAsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: DATABASE_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      }
    }

    const inject = [(options.useClass || options.useExisting) as Type<DatabaseOptionsFactory>]

    return {
      provide: DATABASE_MODULE_OPTIONS,
      useFactory: (optionsFactory: DatabaseOptionsFactory) => optionsFactory.createOptions(),
      inject,
    }
  }
}
