import { Module } from '@nestjs/common'

import { AuthCoreModule } from './auth-core.module'
import { AuthModuleOptions } from './types'

import { ModuleWithOptions } from '@/modules/shared/classes'
import { AsyncModuleOptions } from '@/modules/shared/interfaces'

@Module({})
export class AuthModule extends ModuleWithOptions {
  static module = AuthModule
  static coreModule = AuthCoreModule

  static forRoot(options: AuthModuleOptions) {
    return super.forRoot(options)
  }

  static forRootAsync(options: AsyncModuleOptions<AuthModuleOptions>) {
    return super.forRootAsync(options)
  }
}
