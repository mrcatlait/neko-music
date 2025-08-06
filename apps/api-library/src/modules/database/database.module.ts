import { Module } from '@nestjs/common'

import { DatabaseCoreModule } from './database-core.module'
import { DatabaseModuleOptions } from './types'

import { ModuleWithOptions } from '@modules/app/classes'

@Module({})
export class DatabaseModule extends ModuleWithOptions<DatabaseModuleOptions> {
  module = DatabaseModule
  coreModule = DatabaseCoreModule
}
