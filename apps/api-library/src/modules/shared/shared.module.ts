import { Global, Module } from '@nestjs/common'

import { CryptoService } from './services'

@Global()
@Module({
  providers: [CryptoService],
  exports: [CryptoService],
})
export class SharedModule {}
