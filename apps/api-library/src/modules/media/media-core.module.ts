import { Module } from '@nestjs/common'

import { MEDIA_MODULE_OPTIONS } from './tokens'
import { ProcessArtistArtworkCron, UploadTokenCleanupCron } from './crons'
import { GenerateUploadTokenUseCase, UploadMediaUseCase, UploadMediaValidator } from './use-cases'
import { ArtistArtworkRepository, ArtistArtworkVariantRepository, UploadTokenRepository } from './repositories'
import { MediaController } from './controllers'

import { CoreModuleWithOptions } from '@/modules/app/classes'

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
    ProcessArtistArtworkCron,
    UploadTokenCleanupCron,
    // Repositories
    ArtistArtworkRepository,
    ArtistArtworkVariantRepository,
    UploadTokenRepository,
  ]
  static exports = [GenerateUploadTokenUseCase, UploadMediaUseCase]
  static controllers = [MediaController]
}
