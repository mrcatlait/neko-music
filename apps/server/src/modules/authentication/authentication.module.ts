import { forwardRef, Module } from '@nestjs/common'

import { AuthenticationService } from './services'
import { AuthenticationController } from './controllers'
import { AuthGuard } from './guards'

import { UserModule } from '@modules/user'

@Module({
  imports: [forwardRef(() => UserModule)],
  providers: [AuthenticationService, AuthGuard],
  controllers: [AuthenticationController],
  exports: [AuthenticationService, AuthGuard],
})
export class AuthenticationModule {}
