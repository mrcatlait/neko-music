import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InsertResult, Repository } from 'typeorm'

import { UserRoleEntity } from '../entities'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly roleRepository: Repository<UserRoleEntity>,
  ) {}

  getRoles(): Promise<UserRoleEntity[]> {
    return this.roleRepository.find({ relations: { permissions: true } })
  }

  createRole(name: string, description?: string): Promise<InsertResult> {
    return this.roleRepository.insert({ name, description })
  }
}
