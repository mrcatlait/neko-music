import { NotFoundError } from 'elysia'

import { UserRoleEntity } from '../entities'
import { RoleRepository } from '../repositories'

import { Handler } from '@common/models'
import { Container } from '@common/di'

export class GetDefaultRoleQuery implements Handler<void, UserRoleEntity> {
  private readonly roleRepository: RoleRepository

  constructor() {
    this.roleRepository = Container.get(RoleRepository)
  }

  async handle(): Promise<UserRoleEntity> {
    const defaultRole = await this.roleRepository.getDefaultRole()

    if (!defaultRole) {
      throw new NotFoundError('Default role not found')
    }

    return defaultRole
  }
}
