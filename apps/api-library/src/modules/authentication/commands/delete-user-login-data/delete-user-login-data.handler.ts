import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { DeleteUserLoginDataCommand } from './delete-user-login-data.command'

import { UserLoginDataRepository } from '@modules/authentication/repositories'

@CommandHandler(DeleteUserLoginDataCommand)
export class DeleteUserLoginDataHandler implements ICommandHandler<DeleteUserLoginDataCommand> {
  constructor(private readonly userLoginDataRepository: UserLoginDataRepository) {}

  execute(command: DeleteUserLoginDataCommand): Promise<void> {
    return this.userLoginDataRepository.delete(command.userId)
  }
}
