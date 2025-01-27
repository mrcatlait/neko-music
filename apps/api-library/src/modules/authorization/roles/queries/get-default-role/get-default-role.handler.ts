import { Injectable, NotFoundException } from '@nestjs/common'

import { RoleRepository } from '../../../shared/repositories'
import { UserRoleEntity } from '../../../shared/entities'

import { Handler } from '@modules/shared/models'

@Injectable()
export class GetDefaultRoleHandler implements Handler<void, UserRoleEntity> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async handle(): Promise<UserRoleEntity> {
    const defaultRole = await this.roleRepository.getDefaultRole()

    if (!defaultRole) {
      throw new NotFoundException('Default role not found')
    }

    return defaultRole
  }
}
