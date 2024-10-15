import { Global, Module } from '@nestjs/common'

import { ConfigService, ImageProcessingService, VideoProcessingService } from './services'

const providers = [ConfigService, ImageProcessingService, VideoProcessingService]

@Global()
@Module({
  providers,
  exports: [...providers],
})
export class SharedModule {}
