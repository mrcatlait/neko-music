import { forwardRef, Module } from '@nestjs/common'

import { UserModule } from '../user/user.module'
import { AuthenticationService, CryptoService } from './services'
import { AuthenticationController } from './controllers'

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [AuthenticationService, CryptoService],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
