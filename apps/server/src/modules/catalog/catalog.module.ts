import { Module } from '@nestjs/common'

import { CatalogCoreModule } from './catalog-core.module'
import { CatalogModuleOptions } from './types'

import { ModuleWithOptions } from '@/modules/shared/classes'
import { AsyncModuleOptions } from '@/modules/shared/interfaces'

@Module({})
export class CatalogModule extends ModuleWithOptions {
  static module = CatalogModule
  static coreModule = CatalogCoreModule

  static forRoot(options: CatalogModuleOptions) {
    return super.forRoot(options)
  }

  static forRootAsync(options: AsyncModuleOptions<CatalogModuleOptions>) {
    return super.forRootAsync(options)
  }
}
