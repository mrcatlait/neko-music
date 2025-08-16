import { Global, Inject, Module } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { MEDIA_MODULE_OPTIONS } from './tokens'
import { TriggerMediaProcessingCron, UploadTokenCleanupCron } from './crons'
import { GenerateUploadTokenUseCase, UploadMediaUseCase, UploadMediaValidator } from './use-cases'
import {
  MediaAssetRepository,
  MediaImageMetadataRepository,
  MediaSourceRepository,
  ProcessingJobRepository,
  ProcessingPipelineRepository,
  UploadTokenRepository,
} from './repositories'
import { MediaController, StreamingController } from './controllers'
import { FileUtilsService, ImageService, StreamingService } from './services'
import { MediaModuleOptions } from './types'
import { ProcessMediaEvent, ProcessMediaEventHandler } from './events'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class MediaCoreModule extends CoreModuleWithOptions {
  static module = MediaCoreModule
  static optionsToken = MEDIA_MODULE_OPTIONS
  static providers = [
    // Use cases
    GenerateUploadTokenUseCase,
    UploadMediaUseCase,
    UploadMediaValidator,
    // Crons
    TriggerMediaProcessingCron,
    UploadTokenCleanupCron,
    // Events
    ProcessMediaEventHandler,
    // Repositories
    MediaAssetRepository,
    MediaImageMetadataRepository,
    MediaSourceRepository,
    ProcessingJobRepository,
    ProcessingPipelineRepository,
    UploadTokenRepository,
    // Services
    FileUtilsService,
    ImageService,
    StreamingService,
  ]
  static exports = [GenerateUploadTokenUseCase, UploadMediaUseCase]
  static controllers = [MediaController, StreamingController]

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
