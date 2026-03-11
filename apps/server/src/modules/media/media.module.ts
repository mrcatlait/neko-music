import { Module } from '@nestjs/common'

import { MediaCoreModule } from './media-core.module'
import { MediaModuleOptions } from './types'

import { ModuleWithOptions } from '@/modules/shared/classes'
import { AsyncModuleOptions } from '@/modules/shared/interfaces'

@Module({})
export class MediaModule extends ModuleWithOptions {
  static readonly module = MediaModule
  static readonly coreModule = MediaCoreModule

  static forRoot(options: MediaModuleOptions) {
    return super.forRoot(options)
  }

  static forRootAsync(options: AsyncModuleOptions<MediaModuleOptions>) {
    return super.forRootAsync(options)
  }
}
