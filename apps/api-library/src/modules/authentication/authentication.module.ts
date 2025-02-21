import { Global, Module } from '@nestjs/common'

import { AuthController } from './controllers'
import {
  CreateUserLoginDataHandler,
  DeleteUserLoginDataHandler,
  LoginHandler,
  RegisterUserHandler,
  RegisterUserValidator,
} from './commands'
import { WhoamiHandler } from './queries'
import { UserLoginDataRepository } from './repositories'
import { AuthGuard } from './guards'
import { UserRegistrationSaga } from './sagas'

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    // Commands
    CreateUserLoginDataHandler,
    DeleteUserLoginDataHandler,
    LoginHandler,
    RegisterUserHandler,
    RegisterUserValidator,
    // Queries
    WhoamiHandler,
    // Repositories
    UserLoginDataRepository,
    // Sagas
    UserRegistrationSaga,
    // Guards
    AuthGuard,
  ],
})
export class AuthenticationModule {}
