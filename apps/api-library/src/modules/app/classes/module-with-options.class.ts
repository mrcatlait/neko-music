import { DynamicModule, Type } from '@nestjs/common'

import { AsyncModuleOptions } from '../interfaces'
import { CoreModuleWithOptions } from './core-module-with-options.class'

export abstract class ModuleWithOptions {
  protected static module: Type<ModuleWithOptions>
  protected static coreModule: typeof CoreModuleWithOptions

  static forRoot(options: unknown): DynamicModule {
    return {
      module: this.module,
      imports: [this.coreModule.forRoot(options)],
    }
  }

  static forRootAsync(options: AsyncModuleOptions<unknown>): DynamicModule {
    return {
      module: this.module,
      imports: [this.coreModule.forRootAsync(options)],
    }
  }
}
