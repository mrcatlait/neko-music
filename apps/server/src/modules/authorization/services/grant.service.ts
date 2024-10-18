import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm/repository/Repository'
import { InjectRepository } from '@nestjs/typeorm'
import { InsertResult } from 'typeorm'

import { GrantedPermissionEntity } from '../entities'
import { RolePermissions } from '../constants'
import { RoleService } from './role.service'
import { PermissionService } from './permission.service'

@Injectable()
export class GrantService {
  constructor(
    @InjectRepository(GrantedPermissionEntity)
    private readonly rolePermissionRepository: Repository<GrantedPermissionEntity>,
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
  ) {}

  async grantPermissions(): Promise<void> {
    const allPermissions = await this.permissionService.getPermissions()
    const allRoles = await this.roleService.getRoles()

    for (const [roleName, permissions] of Object.entries(RolePermissions)) {
      const role = allRoles.find((r) => r.name === roleName)

      if (!role) {
        continue
      }

      for (const { action, group, type } of permissions) {
        const permission = allPermissions.find((p) => p.action === action && p.group === group && p.type === type)

        if (!permission) {
          continue
        }

        if (role.permissions?.some((p) => p.id === permission.id)) {
          continue
        }

        await this.createRolePermission(role.id, permission.id)
      }
    }
  }

  private createRolePermission(roleId: string, permissionId: string): Promise<InsertResult> {
    return this.rolePermissionRepository.insert({ roleId, permissionId })
  }
}
