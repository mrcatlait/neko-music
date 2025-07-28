import { Global, Module } from '@nestjs/common'

import { MediaController } from './controllers'
import { GenerateUploadTokenHandler, UploadMediaHandler, UploadMediaValidator } from './commands'
import { ProcessArtistArtworkCron, UploadTokenCleanupCron } from './crons'
import { ArtistArtworkRepository, ArtistArtworkVariantRepository, UploadTokenRepository } from './repositories'
import { LocalStorageStrategy, StorageStrategyRegistry } from './strategies/storage'
import { ArtistArtworkUploadStrategy, UploadStrategyRegistry } from './strategies/upload'
import { ArtistArtworkProcessingStrategy, ProcessingStrategyRegistry } from './strategies/processing'
import { ImageProcessingService } from './services'

@Global()
@Module({
  controllers: [MediaController],
  providers: [
    // Commands
    GenerateUploadTokenHandler,
    UploadMediaHandler,
    UploadMediaValidator,
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
