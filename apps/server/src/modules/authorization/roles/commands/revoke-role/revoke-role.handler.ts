import { Injectable } from '@nestjs/common'

import { UserRoleRepository } from '../../../shared/repositories'
import { RevokeRoleCommand } from './revoke-role.command'

import { Handler } from '@modules/shared/models'

@Injectable()
export class RevokeRoleHandler implements Handler<RevokeRoleCommand, void> {
  constructor(private readonly userRoleRepository: UserRoleRepository) {}

  handle(command: RevokeRoleCommand): Promise<void> {
    return this.userRoleRepository.delete(command.userId, command.roleId)
  }
}
