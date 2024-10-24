import { forwardRef, Module } from '@nestjs/common'

import { AuthenticationService } from './services'
import { AuthenticationController } from './controllers'

import { UserModule } from '@modules/user'

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [AuthenticationService],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
