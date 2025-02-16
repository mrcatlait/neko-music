import { Injectable, UnauthorizedException } from '@nestjs/common'

import { UserRoleRepository } from '../../../shared/repositories'
import { AssignRoleValidator } from './assign-role.validator'
import { AssignRoleCommand } from './assign-role.command'

import { Handler } from '@modules/shared/models'

@Injectable()
export class AssignRoleHandler implements Handler<AssignRoleCommand, void> {
  constructor(
    private readonly userRoleRepository: UserRoleRepository,
    private readonly assignRoleValidator: AssignRoleValidator,
  ) {}

  async handle(command: AssignRoleCommand): Promise<void> {
    const validationResult = await this.assignRoleValidator.validate(command)

    if (!validationResult.isValid) {
      throw new UnauthorizedException()
    }

    await this.userRoleRepository.create(command.userId, command.roleId)
  }
}
