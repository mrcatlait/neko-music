import { Injectable } from '@nestjs/common'
import { SagaStep } from '@modules/shared/saga'
import { AssignRoleHandler, RevokeRoleHandler } from '@modules/authorization/roles/commands'
import { RegisterSagaContext } from '../register.saga'

@Injectable()
export class AssignRoleStep extends SagaStep<RegisterSagaContext> {
  constructor(
    private readonly assignRoleHandler: AssignRoleHandler,
    private readonly revokeRoleHandler: RevokeRoleHandler,
  ) {
    super()
  }

  async execute(): Promise<void> {
    if (!this.context.userId) {
      throw new Error('User ID is required')
    }

    if (!this.context.roleId) {
      throw new Error('Role ID is required')
    }

    await this.assignRoleHandler.handle({
      userId: this.context.userId,
      roleId: this.context.roleId,
    })
  }

  async compensate(): Promise<void> {
    if (!this.context.userId) {
      throw new Error('User ID is required')
    }

    if (!this.context.roleId) {
      throw new Error('Role ID is required')
    }

    await this.revokeRoleHandler.handle({
      userId: this.context.userId,
      roleId: this.context.roleId,
    })
  }
}
