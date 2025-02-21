import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { CreateAccountCommand } from './create-account.command'

import { UserAccountRepository } from '@modules/user/repositories'

@CommandHandler(CreateAccountCommand)
export class CreateAccountHandler implements ICommandHandler<CreateAccountCommand> {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  execute(command: CreateAccountCommand): Promise<void> {
    return this.userAccountRepository
      .create({
        user_id: command.userId,
        display_name: command.displayName,
      })
      .then(() => undefined)
  }
}
