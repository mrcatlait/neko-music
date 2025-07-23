import { Global, Module } from '@nestjs/common'

import { MediaController } from './controllers'
import { GenerateUploadTokenHandler, UploadMediaHandler, UploadMediaValidator } from './commands'
import { UploadTokenCleanupCron } from './crons'
import { ArtistArtworkRepository, ArtistArtworkVariantRepository, UploadTokenRepository } from './repositories'
import { StorageStrategyModule } from './strategies/storage'
import { UploadStrategyModule } from './strategies/upload'

@Global()
@Module({
  controllers: [MediaController],
  providers: [
    // Commands
    GenerateUploadTokenHandler,
    UploadMediaHandler,
    UploadMediaValidator,
    // Crons
    UploadTokenCleanupCron,
    // Repositories
    ArtistArtworkRepository,
    ArtistArtworkVariantRepository,
    UploadTokenRepository,
    // Strategies
    StorageStrategyModule,
    UploadStrategyModule,
  ],
})
export class MediaModule {}
