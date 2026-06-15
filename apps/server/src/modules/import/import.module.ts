import { Module } from '@nestjs/common'

import { ImportModuleOptions } from './module-options'
import { ImportCoreModule } from './import-core.module'

import { ModuleWithOptions } from '@/modules/shared/classes'
import { AsyncModuleOptions } from '@/modules/shared/types'

@Module({})
export class ImportModule extends ModuleWithOptions {
  static readonly module = ImportModule
  static readonly coreModule = ImportCoreModule

  static forRoot(options: ImportModuleOptions) {
    return super.forRoot(options)
  }

  static forRootAsync(options: AsyncModuleOptions<ImportModuleOptions>) {
    return super.forRootAsync(options)
  }
}
