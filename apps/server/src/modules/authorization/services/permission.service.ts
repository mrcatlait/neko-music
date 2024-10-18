import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InsertResult, Repository } from 'typeorm'
import { Permission, PermissionAction, PermissionGroup, PermissionType } from '@neko/permissions'

import { PermissionEntity } from '../entities'

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  getPermissions(): Promise<PermissionEntity[]> {
    return this.permissionRepository.find()
  }

  async setPermissions(): Promise<void> {
    const roles = await this.getPermissions()

    for (const { action, group, type } of Object.values(Permission)) {
      if (roles.find((r) => r.action === action)) {
        continue
      }

      await this.createPermission(action, group, type)
    }
  }

  private createPermission(
    action: PermissionAction,
    group: PermissionGroup,
    type: PermissionType,
  ): Promise<InsertResult> {
    return this.permissionRepository.insert({ action, group, type })
  }
}
