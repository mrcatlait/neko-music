import { Injectable } from '@nestjs/common'

import { CreateAccountCommand } from './create-account.command'

import { Handler } from '@modules/shared/models'
import { UserAccountRepository } from '@modules/user/shared/repositories'

@Injectable()
export class CreateAccountHandler implements Handler<CreateAccountCommand, void> {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  async handle(command: CreateAccountCommand): Promise<void> {
    await this.userAccountRepository.create({
      user_id: command.userId,
      display_name: command.displayName,
    })
  }
}
