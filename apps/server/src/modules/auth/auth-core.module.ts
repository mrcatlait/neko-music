import { Module } from '@nestjs/common'

import { AUTH_MODULE_OPTIONS } from './tokens'
import {
  GetUserUseCase,
  LoginUseCase,
  LoginValidator,
  RefreshTokenUseCase,
  RegisterUserUseCase,
  RegisterUserValidator,
  UpdateRoleUseCase,
} from './use-cases'
import { AuthRepository } from './repositories'
import { AuthGuard } from './guards'
import { AuthController } from './controllers'
import { AuthService, JwtService } from './services'
import { CleanupExpiredRefreshTokensCron } from './crons'
import { AdministratorService } from './services/administrator.service'

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
    AuthRepository,
    // Services
    AdministratorService,
    AuthService,
    JwtService,
    // Use cases
    GetUserUseCase,
    LoginUseCase,
    LoginValidator,
    RefreshTokenUseCase,
    RegisterUserUseCase,
    RegisterUserValidator,
    UpdateRoleUseCase,
  ]
  static controllers = [AuthController]
  static exports = [AuthService, JwtService]
}
