import { Global, Module } from '@nestjs/common'

import { MediaCoreModule } from './media-core.module'
import { MediaModuleOptions } from './types'

import { ModuleWithOptions } from '@modules/app/classes'

@Global()
@Module({})
export class MediaModule extends ModuleWithOptions<MediaModuleOptions> {
  module = MediaModule
  coreModule = MediaCoreModule
}
