import { Injectable } from '@nestjs/common'
import { SagaStep } from '@modules/shared/saga'
import { CreateAccountHandler, DeleteAccountHandler } from '@modules/user/account/commands'
import { RegisterSagaContext } from '../register.saga'

@Injectable()
export class CreateAccountStep extends SagaStep<RegisterSagaContext> {
  constructor(
    private readonly createAccountHandler: CreateAccountHandler,
    private readonly deleteAccountHandler: DeleteAccountHandler,
  ) {
    super()
  }

  async execute(): Promise<void> {
    if (!this.context.userId) {
      throw new Error('User ID is required')
    }

    await this.createAccountHandler.handle({
      userId: this.context.userId,
      displayName: this.context.displayName,
    })
  }

  async compensate(): Promise<void> {
    if (!this.context.userId) {
      throw new Error('User ID is required')
    }

    await this.deleteAccountHandler.handle({
      userId: this.context.userId,
    })
  }
}
