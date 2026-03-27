import { Inject, Module } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { MEDIA_MODULE_OPTIONS } from './tokens'
import { MediaController, StreamingController } from './controllers'
import {
  AssetCleanupService,
  AudioService,
  DashService,
  FileService,
  ImageService,
  ProcessingPipelineService,
  StreamingService,
  UploadTokenService,
} from './services'
import { MediaModuleOptions } from './types'
import {
  GenerateUploadTokenUseCase,
  GetArtworkUseCase,
  UploadMediaUseCase,
  UploadAudioValidator,
  UploadImageValidator,
  GetMediaReadinessUseCase,
  GetProcessingStatusUseCase,
} from './use-cases'
import {
  AssetRepository,
  AudioMetadataRepository,
  ImageMetadataRepository,
  MediaRepository,
  SourceAssetRepository,
  ProcessingJobRepository,
  UploadTokenRepository,
} from './repositories'
import { TriggerMediaProcessingCron, UploadTokenCleanupCron } from './crons'
import { MediaListener } from './listeners'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class MediaCoreModule extends CoreModuleWithOptions {
  static readonly module = MediaCoreModule
  static readonly optionsToken = MEDIA_MODULE_OPTIONS
  static readonly providers = [
    // Crons
    TriggerMediaProcessingCron,
    UploadTokenCleanupCron,
    // Services
    AssetCleanupService,
    AudioService,
    DashService,
    FileService,
    ImageService,
    ProcessingPipelineService,
    StreamingService,
    UploadTokenService,
    // Repositories
    MediaRepository,
    SourceAssetRepository,
    AssetRepository,
    ImageMetadataRepository,
    AudioMetadataRepository,
    ProcessingJobRepository,
    UploadTokenRepository,
    // Use Cases
    GenerateUploadTokenUseCase,
    GetArtworkUseCase,
    GetMediaReadinessUseCase,
    GetProcessingStatusUseCase,
    UploadMediaUseCase,
    UploadAudioValidator,
    UploadImageValidator,
    // Listeners
    MediaListener,
  ]
  static readonly exports = [
    GenerateUploadTokenUseCase,
    GetArtworkUseCase,
    GetMediaReadinessUseCase,
    GetProcessingStatusUseCase,
  ]
  static readonly controllers = [MediaController, StreamingController]

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
