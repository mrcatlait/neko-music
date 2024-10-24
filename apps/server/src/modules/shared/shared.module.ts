import { Global, Module } from '@nestjs/common'

import { ConfigService, CryptoService, ImageProcessingService, VideoProcessingService } from './services'

const providers = [ConfigService, CryptoService, ImageProcessingService, VideoProcessingService]

@Global()
@Module({
  providers,
  exports: [...providers],
})
export class SharedModule {}
