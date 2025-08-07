import { Global, Module } from '@nestjs/common'

import { AuthController } from './controllers'
import { AuthGuard } from './guards'
import { LoginUseCase, LoginValidator, RegisterUserUseCase, RegisterUserValidator } from './use-cases'
import {
  PermissionRepository,
  RolePermissionRepository,
  RoleRepository,
  UserAccountRepository,
  UserCredentialsRepository,
} from './repositories'

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    // Use cases
    LoginUseCase,
    LoginValidator,
    RegisterUserUseCase,
    RegisterUserValidator,
    // Repositories
    PermissionRepository,
    RolePermissionRepository,
    RoleRepository,
    UserAccountRepository,
    UserCredentialsRepository,
    // Guards
    AuthGuard,
  ],
})
export class AuthModule {}
