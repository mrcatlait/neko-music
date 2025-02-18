import { Global, Module } from '@nestjs/common'

import { AuthController } from './infrastructure/controllers'
import { LoginHandler, LoginValidator } from './login/commands'
import { RegisterHandler, RegisterValidator } from './registration/commands'
import { UserLoginDataRepository } from './shared/repositories'
import { AuthGuard } from './infrastructure/guards'
import { WhoamiHandler } from './whoami/queries'
import {
  CreateAccountStep,
  AssignRoleStep,
  CreateUserLoginDataStep,
  RegisterSaga,
  GetDefaultRoleStep,
} from './registration/sagas'

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    AuthGuard,
    LoginHandler,
    LoginValidator,
    RegisterHandler,
    RegisterValidator,
    UserLoginDataRepository,
    WhoamiHandler,
    CreateAccountStep,
    AssignRoleStep,
    CreateUserLoginDataStep,
    RegisterSaga,
    GetDefaultRoleStep,
  ],
})
export class AuthenticationModule {}
