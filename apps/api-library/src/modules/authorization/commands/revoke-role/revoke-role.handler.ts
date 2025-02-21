import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { RevokeRoleCommand } from './revoke-role.command'

import { UserRoleRepository } from '@modules/authorization/repositories'

@CommandHandler(RevokeRoleCommand)
export class RevokeRoleHandler implements ICommandHandler<RevokeRoleCommand> {
  constructor(private readonly userRoleRepository: UserRoleRepository) {}

  execute(command: RevokeRoleCommand): Promise<void> {
    return this.userRoleRepository.delete(command.userId, command.roleId)
  }
}
