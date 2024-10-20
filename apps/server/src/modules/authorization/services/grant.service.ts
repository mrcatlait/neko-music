import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm/repository/Repository'
import { InjectRepository } from '@nestjs/typeorm'
import { InsertResult } from 'typeorm'

import { GrantedPermissionEntity } from '../entities'

@Injectable()
export class GrantService {
  constructor(
    @InjectRepository(GrantedPermissionEntity)
    private readonly rolePermissionRepository: Repository<GrantedPermissionEntity>,
  ) {}

  createRolePermission(roleId: string, permissionId: string): Promise<InsertResult> {
    return this.rolePermissionRepository.insert({ roleId, permissionId })
  }
}
