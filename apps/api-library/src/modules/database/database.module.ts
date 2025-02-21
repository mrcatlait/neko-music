import { DynamicModule, Module } from '@nestjs/common'

import { DatabaseCoreModule } from './database-core.module'
import { DatabaseModuleAsyncOptions, DatabaseModuleOptions } from './types'

@Module({})
export class DatabaseModule {
  static forRoot(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [DatabaseCoreModule.forRoot(options)],
    }
  }

  static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [DatabaseCoreModule.forRootAsync(options)],
    }
  }
}
