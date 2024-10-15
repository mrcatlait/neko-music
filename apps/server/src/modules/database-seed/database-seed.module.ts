import { DynamicModule, Module } from '@nestjs/common'

import { DatabaseSeedCoreModule } from './database-seed-core.module'
import { TypeOrmSeedModuleAsyncOptions, TypeOrmSeedModuleOptions } from './types'

@Module({})
export class DatabaseSeedModule {
  static forRoot(options?: TypeOrmSeedModuleOptions): DynamicModule {
    return {
      module: DatabaseSeedModule,
      imports: [DatabaseSeedCoreModule.forRoot(options)],
    }
  }

  static forRootAsync(options: TypeOrmSeedModuleAsyncOptions): DynamicModule {
    return {
      module: DatabaseSeedModule,
      imports: [DatabaseSeedCoreModule.forRootAsync(options)],
    }
  }
}
