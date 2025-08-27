import { Module } from '@nestjs/common'

import { ConfigCoreModule } from './config-core.module'
import { ConfigModuleOptions } from './types'

import { ModuleWithOptions } from '@/modules/shared/classes'
import { AsyncModuleOptions } from '@/modules/shared/interfaces'

@Module({})
export class ConfigModule extends ModuleWithOptions {
  static module = ConfigModule
  static coreModule = ConfigCoreModule

  static forRoot(options: ConfigModuleOptions) {
    return super.forRoot(options)
  }

  static forRootAsync(options: AsyncModuleOptions<ConfigModuleOptions>) {
    return super.forRootAsync(options)
  }
}
