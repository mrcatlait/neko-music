import { Role } from '../models'
import { RoleRepository } from '../repositories'

import { NotFoundException } from '@common/exceptions'

export class AuthorizationQueryService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async getDefaultRole(): Promise<Role> {
    const defaultRole = await this.roleRepository.getDefaultRole()

    if (!defaultRole) {
      throw new NotFoundException()
    }

    return defaultRole
  }
}
