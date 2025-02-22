import { NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'

import { GetDefaultRoleQuery } from './get-default-role.query'

import { RoleEntity } from '@modules/authorization/entities'
import { RoleRepository } from '@modules/authorization/repositories'

@QueryHandler(GetDefaultRoleQuery)
export class GetDefaultRoleHandler implements IQueryHandler<GetDefaultRoleQuery> {
  constructor(private readonly roleRepository: RoleRepository) {}

  async execute(): Promise<RoleEntity> {
    const defaultRole = await this.roleRepository.findDefault()

    if (!defaultRole) {
      throw new NotFoundException('Default role not found')
    }

    return defaultRole
  }
}
