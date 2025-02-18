import { Global, Module } from '@nestjs/common'

import { GetDefaultRoleHandler } from './roles/queries'
import {
  PermissionRepository,
  RoleRepository,
  UserPermissionRepository,
  UserRoleRepository,
} from './shared/repositories'
import { AssignRoleHandler, AssignRoleValidator, RevokeRoleHandler } from './roles/commands'
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
    RevokeRoleHandler,
  ],
  exports: [AssignRoleHandler, GetDefaultRoleHandler, GetPermissionsHandler, RevokeRoleHandler],
})
export class AuthorizationModule {}
