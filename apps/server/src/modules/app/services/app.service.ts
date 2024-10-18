import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'

import { UserAccountService, UserLoginDataService } from '@modules/user/services'
import { ConfigService } from '@shared/services'
import { GrantService, PermissionService, RoleService } from '@modules/authorization/services'
import { Role } from '@modules/authorization/constants'

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name)

  private readonly moduleOptions = { strict: false }

  private configService: ConfigService
  private userLoginDataService: UserLoginDataService
  private userAccountService: UserAccountService
  private roleService: RoleService
  private permissionService: PermissionService
  private grantService: GrantService
  constructor(private readonly moduleRef: ModuleRef) {}

  async onModuleInit(): Promise<void> {
    this.configService = this.moduleRef.get(ConfigService, this.moduleOptions)
    this.userLoginDataService = this.moduleRef.get(UserLoginDataService, this.moduleOptions)
    this.userAccountService = this.moduleRef.get(UserAccountService, this.moduleOptions)
    this.roleService = this.moduleRef.get(RoleService, this.moduleOptions)
    this.permissionService = this.moduleRef.get(PermissionService, this.moduleOptions)
    this.grantService = this.moduleRef.get(GrantService, this.moduleOptions)

    await Promise.all([this.initRoles(), this.initPermissions()])
    await this.initRolePermissions()
    await this.initRootUser()
  }

  private async initRoles(): Promise<void> {
    await this.roleService.setRoles()
    this.logger.log(`Roles have been initiated`)
  }

  private async initPermissions(): Promise<void> {
    await this.permissionService.setPermissions()
    this.logger.log(`Permissions have been initiated`)
  }

  private async initRolePermissions(): Promise<void> {
    await this.grantService.grantPermissions()
    this.logger.log(`Role permissions have been initiated`)
  }

  private async initRootUser(): Promise<void> {
    const rootEmail = this.configService.get('ROOT_USER_EMAIL')
    const rootPassword = this.configService.get('ROOT_USER_PASSWORD')

    const isExistRootUser = await this.userLoginDataService.findByEmail(rootEmail)

    if (isExistRootUser) {
      return
    }

    await this.userAccountService.createUserAccount('Admin', rootEmail, rootPassword, Role.ADMIN)

    this.logger.log(`Root user has been initiated`)
  }
}
