import { Global, Module } from '@nestjs/common'

import { ProcessingMediaRepository, UploadTokenRepository } from './repositories'
import { UploadTokenCleanupCron } from './crons'
import { FileUploadService, ImageProcessingService } from './services'
import { GenerateUploadTokenHandler, UploadMediaHandler, UploadMediaValidator } from './commands'
import { MediaController } from './controllers'

@Global()
@Module({
  controllers: [MediaController],
  providers: [
    // Commands
    GenerateUploadTokenHandler,
    UploadMediaHandler,
    // Validators
    UploadMediaValidator,
    // Repositories
    ProcessingMediaRepository,
    UploadTokenRepository,
    // Services
    FileUploadService,
    ImageProcessingService,
    // Crons
    UploadTokenCleanupCron,
  ],
})
export class MediaModule {}
