import { Injectable } from '@nestjs/common'

import { DeleteAccountCommand } from './delete-account.command'

import { Handler } from '@modules/shared/models'
import { UserAccountRepository } from '@modules/user/shared/repositories'

@Injectable()
export class DeleteAccountHandler implements Handler<DeleteAccountCommand, void> {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  async handle(command: DeleteAccountCommand): Promise<void> {
    await this.userAccountRepository.delete(command.userId)
  }
}
