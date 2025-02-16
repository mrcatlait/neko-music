import { Global, Module } from '@nestjs/common'

import { GetDefaultRoleHandler } from './roles/queries'
import {
  PermissionRepository,
  RoleRepository,
  UserPermissionRepository,
  UserRoleRepository,
} from './shared/repositories'
import { AssignRoleHandler, AssignRoleValidator } from './roles/commands'
import { GetPermissionsHandler } from './permissions/queries'

@Global()
@Module({
  providers: [
    AssignRoleHandler,
    AssignRoleValidator,
    GetDefaultRoleHandler,
    GetPermissionsHandler,
    PermissionRepository,
    RoleRepository,
    UserRoleRepository,
    UserPermissionRepository,
  ],
  exports: [AssignRoleHandler, GetDefaultRoleHandler, GetPermissionsHandler],
})
export class AuthorizationModule {}
