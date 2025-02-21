import { UnauthorizedException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { AssignRoleValidator } from './assign-role.validator'
import { AssignRoleCommand } from './assign-role.command'

import { UserRoleRepository } from '@modules/authorization/repositories'

@CommandHandler(AssignRoleCommand)
export class AssignRoleHandler implements ICommandHandler<AssignRoleCommand> {
  constructor(
    private readonly userRoleRepository: UserRoleRepository,
    private readonly assignRoleValidator: AssignRoleValidator,
  ) {}

  async execute(command: AssignRoleCommand): Promise<void> {
    const validationResult = await this.assignRoleValidator.validate(command)

    if (!validationResult.isValid) {
      throw new UnauthorizedException()
    }

    await this.userRoleRepository.create(command.userId, command.roleId)
  }
}
