import { Global, Module } from '@nestjs/common'

import { AuthController } from './controllers'
import {
  CreateUserLoginDataHandler,
  DeleteUserLoginDataHandler,
  LoginHandler,
  LoginValidator,
  RegisterUserHandler,
  RegisterUserValidator,
} from './commands'
import { WhoamiHandler } from './queries'
import { UserLoginDataRepository } from './repositories'
import { AuthGuard } from './guards'
import { UserRegistrationAssignRoleEventHandler, UserRegistrationCreateAccountEventHandler } from './events'
import { UserRegistrationSaga } from './sagas'

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    // Commands
    CreateUserLoginDataHandler,
    DeleteUserLoginDataHandler,
    LoginHandler,
    LoginValidator,
    RegisterUserHandler,
    RegisterUserValidator,
    // Queries
    WhoamiHandler,
    // Events
    UserRegistrationAssignRoleEventHandler,
    UserRegistrationCreateAccountEventHandler,
    // Repositories
    UserLoginDataRepository,
    // Sagas
    UserRegistrationSaga,
    // Guards
    AuthGuard,
  ],
})
export class AuthenticationModule {}
