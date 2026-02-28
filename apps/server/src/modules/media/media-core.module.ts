import { Inject, Module } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { MEDIA_MODULE_OPTIONS } from './tokens'
import { MediaController, StreamingController } from './controllers'
import { FileService, ImageService, ProcessingPipelineService, StreamingService, UploadTokenService } from './services'
import { MediaModuleOptions } from './types'
import {
  GenerateUploadTokenUseCase,
  GetArtworkUseCase,
  UploadMediaUseCase,
  UploadAudioValidator,
  UploadImageValidator,
  GetMediaReadinessUseCase,
} from './use-cases'
import { MediaRepository, UploadTokenRepository } from './repositories'
import { TriggerMediaProcessingCron, UploadTokenCleanupCron } from './crons'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class MediaCoreModule extends CoreModuleWithOptions {
  static module = MediaCoreModule
  static optionsToken = MEDIA_MODULE_OPTIONS
  static providers = [
    // Crons
    UploadTokenCleanupCron,
    TriggerMediaProcessingCron,
    // Services
    FileService,
    ImageService,
    ProcessingPipelineService,
    StreamingService,
    UploadTokenService,
    // Repositories
    MediaRepository,
    UploadTokenRepository,
    // Use Cases
    GenerateUploadTokenUseCase,
    GetArtworkUseCase,
    GetMediaReadinessUseCase,
    UploadMediaUseCase,
    UploadAudioValidator,
    UploadImageValidator,
  ]
  static exports = [GenerateUploadTokenUseCase, GetArtworkUseCase, GetMediaReadinessUseCase]
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
