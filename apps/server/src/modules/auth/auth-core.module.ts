import { Inject, Module } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { AUTH_MODULE_OPTIONS } from './tokens'
import { AuthModuleOptions } from './types'
import {
  GetUserUseCase,
  LoginUseCase,
  LoginValidator,
  RefreshTokenUseCase,
  RegisterUserUseCase,
  RegisterUserValidator,
} from './use-cases'
import {
  PermissionRepository,
  RefreshTokenRepository,
  RolePermissionRepository,
  RoleRepository,
  UserAccountRepository,
  UserCredentialsRepository,
} from './repositories'
import { AuthGuard } from './guards'
import { AuthController } from './controllers'
import { AuthService, JwtService } from './services'
import { CleanupExpiredRefreshTokensCron } from './crons'

import { CoreModuleWithOptions } from '@/modules/shared/classes'

@Module({})
export class AuthCoreModule extends CoreModuleWithOptions {
  static module = AuthCoreModule
  static optionsToken = AUTH_MODULE_OPTIONS
  static providers = [
    // Crons
    CleanupExpiredRefreshTokensCron,
    // Guards
    AuthGuard,
    // Repositories
    PermissionRepository,
    RefreshTokenRepository,
    RolePermissionRepository,
    RoleRepository,
    UserAccountRepository,
    UserCredentialsRepository,
    // Services
    AuthService,
    JwtService,
    // Use cases
    GetUserUseCase,
    LoginUseCase,
    LoginValidator,
    RefreshTokenUseCase,
    RegisterUserUseCase,
    RegisterUserValidator,
  ]
  static controllers = [AuthController]
  static exports = [AuthService, JwtService]

  constructor(
    @Inject(AUTH_MODULE_OPTIONS) private readonly options: AuthModuleOptions,
    private readonly moduleRef: ModuleRef,
  ) {
    super()
    this.registerStrategies()
  }

  private registerStrategies() {}
}
