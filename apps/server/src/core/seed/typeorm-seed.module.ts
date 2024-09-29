import { DynamicModule, Module } from '@nestjs/common'

import { TypeOrmSeedCoreModule } from './typeorm-seed-core.module'
import { TypeOrmSeedModuleAsyncOptions, TypeOrmSeedModuleOptions } from './types'

@Module({})
export class TypeOrmSeedModule {
  static forRoot(options?: TypeOrmSeedModuleOptions): DynamicModule {
    return {
      module: TypeOrmSeedModule,
      imports: [TypeOrmSeedCoreModule.forRoot(options)],
    }
  }

  static forRootAsync(options: TypeOrmSeedModuleAsyncOptions): DynamicModule {
    return {
      module: TypeOrmSeedModule,
      imports: [TypeOrmSeedCoreModule.forRootAsync(options)],
    }
  }
}
