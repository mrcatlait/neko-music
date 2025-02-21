import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { DeleteAccountCommand } from './delete-account.command'

import { UserAccountRepository } from '@modules/user/repositories'

@CommandHandler(DeleteAccountCommand)
export class DeleteAccountHandler implements ICommandHandler<DeleteAccountCommand> {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  execute(command: DeleteAccountCommand): Promise<void> {
    return this.userAccountRepository.delete(command.userId)
  }
}
