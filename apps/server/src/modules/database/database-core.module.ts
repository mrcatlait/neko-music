import { Module, Provider } from '@nestjs/common'
import { Kysely } from 'kysely'
import { PostgresJSDialect } from 'kysely-postgres-js'
import postgres from 'postgres'

import { DATABASE, DATABASE_MODULE_OPTIONS } from './database.tokens'
import { DatabaseModuleOptions } from './types'
import { DatabaseMigrationService, DatabaseService } from './services'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

export const kyselyProvider: Provider = {
  provide: DATABASE,
  inject: [DATABASE_MODULE_OPTIONS],
  useFactory: (options: DatabaseModuleOptions) => {
    return new Kysely({
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
  static module = DatabaseCoreModule
  static optionsToken = DATABASE_MODULE_OPTIONS
  static providers = [kyselyProvider, DatabaseService, DatabaseMigrationService]
  static exports = [kyselyProvider]
}
