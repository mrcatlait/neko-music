import { Module } from '@nestjs/common'

import { DatabaseCoreModule } from './database-core.module'
import { DatabaseModuleOptions } from './types'

import { ModuleWithOptions } from '@/modules/shared/classes'
import { AsyncModuleOptions } from '@/modules/shared/interfaces'

@Module({})
export class DatabaseModule extends ModuleWithOptions {
  static module = DatabaseModule
  static coreModule = DatabaseCoreModule

  static forRoot(options: DatabaseModuleOptions) {
    return super.forRoot(options)
  }

  static forRootAsync(options: AsyncModuleOptions<DatabaseModuleOptions>) {
    return super.forRootAsync(options)
  }
}
