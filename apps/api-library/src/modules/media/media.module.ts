import { Global, Module } from '@nestjs/common'

import { MediaCoreModule } from './media-core.module'
import { MediaModuleOptions } from './types'

import { ModuleWithOptions } from '@modules/app/classes'
import { AsyncModuleOptions } from '@modules/app/interfaces'

@Global()
@Module({})
export class MediaModule extends ModuleWithOptions {
  static module = MediaModule
  static coreModule = MediaCoreModule

  static forRoot(options: MediaModuleOptions) {
    return super.forRoot(options)
  }

  static forRootAsync(options: AsyncModuleOptions<MediaModuleOptions>) {
    return super.forRootAsync(options)
  }
}
