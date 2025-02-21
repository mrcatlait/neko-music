import { Global, Module } from '@nestjs/common'

import { StreamingController } from './controllers'
import { StreamingService } from './services'

@Global()
@Module({
  controllers: [StreamingController],
  providers: [StreamingService],
})
export class StreamingModule {}
