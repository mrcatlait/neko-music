import { Global, Module } from '@nestjs/common'

import { UploadTokenRepository } from './shared/repositories'
import { UploadTokenCleanupCron } from './infrastructure/crons'
import { ImageProcessingService } from './shared/services'
import { CreateUploadTokenHandler } from './upload/commands'
import { MediaController } from './infrastructure/controllers'
import { UploadMediaValidator } from './upload/commands/upload-media'
import { UploadMediaHandler } from './upload/commands/upload-media'

@Global()
@Module({
  controllers: [MediaController],
  providers: [
    // Handlers
    CreateUploadTokenHandler,
    UploadMediaHandler,
    // Validators
    UploadMediaValidator,
    // Repositories
    UploadTokenRepository,
    // Services
    ImageProcessingService,
    // Crons
    UploadTokenCleanupCron,
  ],
})
export class MediaModule {}
