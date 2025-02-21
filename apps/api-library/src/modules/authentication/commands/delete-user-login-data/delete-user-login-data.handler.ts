import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UserLoginDataRepository } from '@modules/authentication/repositories'

import { DeleteUserLoginDataCommand } from './delete-user-login-data.command'

@CommandHandler(DeleteUserLoginDataCommand)
export class DeleteUserLoginDataHandler implements ICommandHandler<DeleteUserLoginDataCommand> {
  constructor(private readonly userLoginDataRepository: UserLoginDataRepository) {}

  execute(command: DeleteUserLoginDataCommand): Promise<void> {
    return this.userLoginDataRepository.delete(command.userId)
  }
}
