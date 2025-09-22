import { Module } from '@nestjs/common'

import { BackstageCoreModule } from './backstage-core.module'
import { BackstageModuleOptions } from './types'

import { ModuleWithOptions } from '@/modules/shared/classes'
import { AsyncModuleOptions } from '@/modules/shared/interfaces'

@Module({})
export class BackstageModule extends ModuleWithOptions {
  static module = BackstageModule
  static coreModule = BackstageCoreModule

  static forRoot(options: BackstageModuleOptions) {
    return super.forRoot(options)
  }

  static forRootAsync(options: AsyncModuleOptions<BackstageModuleOptions>) {
    return super.forRootAsync(options)
  }
}
