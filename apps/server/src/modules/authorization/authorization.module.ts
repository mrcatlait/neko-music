import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthorizationService, PermissionService, RoleService, GrantService } from './services'
import { GrantedPermissionEntity, PermissionEntity, UserRoleEntity } from './entities'

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity, UserRoleEntity, GrantedPermissionEntity])],
  providers: [AuthorizationService, RoleService, PermissionService, GrantService],
  exports: [AuthorizationService, RoleService, PermissionService, GrantService],
})
export class AuthorizationModule {}
