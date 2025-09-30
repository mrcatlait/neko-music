import { Inject, Module } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { MEDIA_MODULE_OPTIONS } from './tokens'
import { StreamingController } from './controllers'
import { DashUtilsService, FileUtilsService, StreamingService } from './services'
import { MediaModuleOptions } from './types'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class MediaCoreModule extends CoreModuleWithOptions {
  static module = MediaCoreModule
  static optionsToken = MEDIA_MODULE_OPTIONS
  static providers = [
    // Services
    DashUtilsService,
    FileUtilsService,
    StreamingService,
  ]
  static exports = []
  static controllers = [StreamingController]

  constructor(
    @Inject(MEDIA_MODULE_OPTIONS) private readonly options: MediaModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {
    super()
    this.registerStrategies()
  }

  private registerStrategies() {
    if (this.options.audioTransformStrategy.onInit) {
      this.options.audioTransformStrategy.onInit(this.moduleRef)
    }
  }
}
