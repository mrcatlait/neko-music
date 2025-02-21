import { Global, Module } from '@nestjs/common'

import { AssignRoleHandler, AssignRoleValidator, RevokeRoleHandler } from './commands'
import { GetDefaultRoleHandler, GetPermissionsHandler } from './queries'
import { PermissionRepository, RoleRepository, UserRoleRepository, UserPermissionRepository } from './repositories'

@Global()
@Module({
  providers: [
    // Commands
    AssignRoleHandler,
    AssignRoleValidator,
    RevokeRoleHandler,
    // Queries
    GetDefaultRoleHandler,
    GetPermissionsHandler,
    // Repositories
    PermissionRepository,
    RoleRepository,
    UserRoleRepository,
    UserPermissionRepository,
  ],
  exports: [AssignRoleHandler, GetDefaultRoleHandler, GetPermissionsHandler, RevokeRoleHandler],
})
export class AuthorizationModule {}
