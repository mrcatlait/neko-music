import { Global, Module } from '@nestjs/common'

import { DatabaseMigrationService, DatabaseSeedService, DatabaseService } from './services'
import { DATABASE_MODULE_OPTIONS } from './database.tokens'

import { CoreModuleWithOptions } from '@/modules/app/classes'

@Global()
@Module({})
export class DatabaseCoreModule extends CoreModuleWithOptions {
  static module = DatabaseCoreModule
  static optionsToken = DATABASE_MODULE_OPTIONS
  static providers = [DatabaseMigrationService, DatabaseSeedService, DatabaseService]
  static exports = [DatabaseService]
}
