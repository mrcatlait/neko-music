import { Module, Provider } from '@nestjs/common'
import { Kysely } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'

import { DATABASE, DATABASE_MODULE_OPTIONS } from './database.tokens'
import { DatabaseModuleOptions } from './types'
import { DatabaseMigrationService, DatabaseSeedService, DatabaseService } from './services'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

export const kyselyProvider: Provider = {
  provide: DATABASE,
  inject: [DATABASE_MODULE_OPTIONS],
  useFactory: (options: DatabaseModuleOptions) => {
    return new Kysely({
      log: ['error', 'query'], // 'query', 'error'
      // log(event: LogEvent): void {
      //   if (event.level === 'error') {
      //     throw event.error
      //   }
      // },
      dialect: new PostgresJSDialect({
        postgres: postgres({
          database: options.database,
          host: options.host,
          port: options.port,
          username: options.username,
          password: options.password,
        }),
      }),
    })
  },
}

@Module({})
export class DatabaseCoreModule extends CoreModuleWithOptions {
  static readonly module = DatabaseCoreModule
  static readonly optionsToken = DATABASE_MODULE_OPTIONS
  static readonly providers = [kyselyProvider, DatabaseService, DatabaseMigrationService, DatabaseSeedService]
  static readonly exports = [kyselyProvider]
}
