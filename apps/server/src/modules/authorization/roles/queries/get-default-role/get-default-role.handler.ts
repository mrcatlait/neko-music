import { Injectable, NotFoundException } from '@nestjs/common'

import { RoleRepository } from '../../../shared/repositories'
import { RoleEntity } from '../../../shared/entities'

import { Handler } from '@modules/shared/models'

@Injectable()
export class GetDefaultRoleHandler implements Handler<void, RoleEntity> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async handle(): Promise<RoleEntity> {
    const defaultRole = await this.roleRepository.getDefault()

    if (!defaultRole) {
      throw new NotFoundException('Default role not found')
    }

    return defaultRole
  }
}
