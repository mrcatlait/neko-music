import { Global, Module } from '@nestjs/common'

import { UploadTokenRepository } from './shared/repositories'
import { UploadTokenCleanupCron } from './infrastructure/crons'
import { ImageProcessingService } from './shared/services'

@Global()
@Module({
  controllers: [],
  providers: [UploadTokenRepository, UploadTokenCleanupCron, ImageProcessingService],
})
export class MediaModule {}
