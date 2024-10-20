import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InsertResult, Repository } from 'typeorm'

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

  createPermission(action: string, description?: string): Promise<InsertResult> {
    return this.permissionRepository.insert({ action, description })
  }
}
