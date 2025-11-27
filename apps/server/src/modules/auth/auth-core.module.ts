import { Inject, Module, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Permissions } from '@neko/permissions'

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
export class AuthCoreModule extends CoreModuleWithOptions implements OnApplicationBootstrap {
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

  async onApplicationBootstrap() {
    await this.moduleRef.get(PermissionRepository).createMany([
      {
        name: Permissions.Track.Read,
        description: 'Ability to view track information',
      },
      {
        name: Permissions.Track.Write,
        description: 'Ability to modify track information',
      },
      {
        name: Permissions.Track.Download,
        description: 'Ability to download tracks',
      },
      {
        name: Permissions.Library.Read,
        description: 'Ability to view library information',
      },
      {
        name: Permissions.Library.Write,
        description: 'Ability to modify library information',
      },
      {
        name: Permissions.Playlist.Read,
        description: 'Ability to view playlist information',
      },
      {
        name: Permissions.Playlist.Write,
        description: 'Ability to modify playlist information',
      },
      {
        name: Permissions.Playlist.Follow,
        description: 'Ability to follow playlists',
      },
      {
        name: Permissions.Album.Read,
        description: 'Ability to view album information',
      },
      {
        name: Permissions.Album.Write,
        description: 'Ability to modify album information',
      },
      {
        name: Permissions.Album.Download,
        description: 'Ability to download albums',
      },
      {
        name: Permissions.Artist.Read,
        description: 'Ability to view artist information',
      },
      {
        name: Permissions.Artist.Write,
        description: 'Ability to modify artist information',
      },
      {
        name: Permissions.Artist.Manage,
        description: 'Ability to manage artist information',
      },
      {
        name: Permissions.Artist.ManageAll,
        description: 'Ability to manage all artist information',
      },
      {
        name: Permissions.Artist.Follow,
        description: 'Ability to follow artists',
      },
      {
        name: Permissions.Genre.Read,
        description: 'Ability to view genre information',
      },
      {
        name: Permissions.Genre.Write,
        description: 'Ability to modify genre information',
      },
    ])
  }

  private registerStrategies() {}
}
