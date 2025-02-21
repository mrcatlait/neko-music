import { Global, Module } from '@nestjs/common'

import { ProcessingMediaRepository, UploadTokenRepository } from './shared/repositories'
import { UploadTokenCleanupCron } from './infrastructure/crons'
import { FileUploadService, ImageProcessingService } from './shared/services'
import {
  CreateUploadTokenHandler,
  ProcessImageHandler,
  ProcessImageValidator,
  UploadMediaHandler,
  UploadMediaValidator,
} from './upload/commands'
import { MediaController } from './infrastructure/controllers'
import { UploadMediaSaga } from './upload/sagas'
import { GetProcessingMediaHandler, GetUploadTokenHandler } from './upload/queries'

@Global()
@Module({
  controllers: [MediaController],
  providers: [
    // Handlers
    CreateUploadTokenHandler,
    GetUploadTokenHandler,
    GetProcessingMediaHandler,
    UploadMediaHandler,
    ProcessImageHandler,
    // Validators
    UploadMediaValidator,
    ProcessImageValidator,
    // Repositories
    ProcessingMediaRepository,
    UploadTokenRepository,
    // Services
    FileUploadService,
    ImageProcessingService,
    // Crons
    UploadTokenCleanupCron,
    // Sagas
    UploadMediaSaga,
  ],
})
export class MediaModule {}
