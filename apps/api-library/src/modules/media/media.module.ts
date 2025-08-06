import { Global, Module } from '@nestjs/common'

import { MediaController } from './controllers'
import { ProcessArtistArtworkCron, UploadTokenCleanupCron } from './crons'
import { ArtistArtworkRepository, ArtistArtworkVariantRepository, UploadTokenRepository } from './repositories'
import { LocalStorageStrategy, StorageStrategyRegistry } from './strategies/storage'
import { ArtistArtworkUploadStrategy, UploadStrategyRegistry } from './strategies/upload'
import { ArtistArtworkProcessingStrategy, ProcessingStrategyRegistry } from './strategies/processing'
import { ImageProcessingService } from './services'
import { GenerateUploadTokenUseCase, UploadMediaUseCase } from './use-cases'

@Global()
@Module({
  controllers: [MediaController],
  providers: [
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
    // Upload strategies
    ArtistArtworkUploadStrategy,
    UploadStrategyRegistry,
    // Storage strategies
    LocalStorageStrategy,
    StorageStrategyRegistry,
    // Processing strategies
    ArtistArtworkProcessingStrategy,
    ProcessingStrategyRegistry,
    // Services
    ImageProcessingService,
  ],
})
export class MediaModule {}
