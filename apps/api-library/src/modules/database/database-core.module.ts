import { Global, Module } from '@nestjs/common'

import { DatabaseModuleOptions } from './types'
import { DatabaseMigrationService, DatabaseSeedService, DatabaseService } from './services'
import { DATABASE_MODULE_OPTIONS } from './database.tokens'

import { CoreModuleWithOptions } from '@modules/app/classes'

@Global()
@Module({})
export class DatabaseCoreModule extends CoreModuleWithOptions<DatabaseModuleOptions> {
  module = DatabaseCoreModule
  optionsToken = DATABASE_MODULE_OPTIONS
  providers = [DatabaseMigrationService, DatabaseSeedService, DatabaseService]
  exports = [DatabaseService]
}
