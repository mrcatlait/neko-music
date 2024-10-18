import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InsertResult, Repository } from 'typeorm'

import { UserRoleEntity } from '../entities'
import { Role } from '../constants'

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(UserRoleEntity)
    private readonly roleRepository: Repository<UserRoleEntity>,
  ) {}

  getRoles(): Promise<UserRoleEntity[]> {
    return this.roleRepository.find({ relations: { permissions: true } })
  }

  async setRoles(): Promise<void> {
    const roles = await this.getRoles()

    // Loop through the Role enum
    for (const role of Object.values<string>(Role)) {
      if (roles.find((r) => r.name === role)) {
        continue
      }

      await this.createRole(role)
    }
  }

  private createRole(name: string, description?: string): Promise<InsertResult> {
    return this.roleRepository.insert({ name, description })
  }
}
