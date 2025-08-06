import { DynamicModule, Type } from '@nestjs/common'

import { AsyncModuleOptions } from '../interfaces'
import { CoreModuleWithOptions } from './core-module-with-options.class'

export abstract class ModuleWithOptions<Options> {
  protected abstract module: Type<ModuleWithOptions<Options>>
  protected abstract coreModule: Type<CoreModuleWithOptions<Options>>

  forRoot(options: Options): DynamicModule {
    return {
      module: this.module,
      imports: [(this.coreModule as unknown as CoreModuleWithOptions<Options>).forRoot(options)],
    }
  }

  forRootAsync(options: AsyncModuleOptions<Options>): DynamicModule {
    return {
      module: this.module,
      imports: [(this.coreModule as unknown as CoreModuleWithOptions<Options>).forRootAsync(options)],
    }
  }
}
