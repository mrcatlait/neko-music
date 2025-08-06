import { Module } from '@nestjs/common'

import { MEDIA_MODULE_OPTIONS } from './tokens'
import { MediaModuleOptions } from './types'
import { ProcessArtistArtworkCron, UploadTokenCleanupCron } from './crons'
import { GenerateUploadTokenUseCase, UploadMediaUseCase } from './use-cases'
import { ArtistArtworkRepository, ArtistArtworkVariantRepository, UploadTokenRepository } from './repositories'
import { MediaController } from './controllers'

import { CoreModuleWithOptions } from '@modules/app/classes'

@Module({})
export class MediaCoreModule extends CoreModuleWithOptions<MediaModuleOptions> {
  module = MediaCoreModule
  optionsToken = MEDIA_MODULE_OPTIONS
  providers = [
    // Use cases
    GenerateUploadTokenUseCase,
    UploadMediaUseCase,
    // Crons
    ProcessArtistArtworkCron,
    UploadTokenCleanupCron,
    // Repositories
    ArtistArtworkRepository,
    ArtistArtworkVariantRepository,
    UploadTokenRepository,
  ]
  exports = [GenerateUploadTokenUseCase, UploadMediaUseCase]
  controllers = [MediaController]
}
