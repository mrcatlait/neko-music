import { Injectable } from '@nestjs/common'
import { SagaStep } from '@modules/shared/saga'
import { GetDefaultRoleHandler } from '@modules/authorization/roles/queries'
import { RegisterSagaContext } from '../register.saga'

@Injectable()
export class GetDefaultRoleStep extends SagaStep<RegisterSagaContext> {
  name = 'getDefaultRole'

  constructor(private readonly getDefaultRoleHandler: GetDefaultRoleHandler) {
    super()
  }

  async execute(): Promise<void> {
    this.context.roleId = (await this.getDefaultRoleHandler.handle()).id
  }

  async compensate(): Promise<void> {
    // No compensation needed for reading data
  }
}
