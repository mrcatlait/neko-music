import { Saga } from '@modules/shared/saga'
import { Injectable } from '@nestjs/common'
import { AssignRoleStep, CreateAccountStep, CreateUserLoginDataStep, GetDefaultRoleStep } from './steps'

export interface RegisterSagaContext {
  email: string
  password: string
  displayName: string
  userId?: string
  roleId?: string
}

@Injectable()
export class RegisterSaga extends Saga {
  constructor(
    private readonly createUserLoginDataStep: CreateUserLoginDataStep,
    private readonly getDefaultRoleStep: GetDefaultRoleStep,
    private readonly createAccountStep: CreateAccountStep,
    private readonly assignRoleStep: AssignRoleStep,
  ) {
    super()
  }

  protected steps = [this.createUserLoginDataStep, this.getDefaultRoleStep, this.createAccountStep, this.assignRoleStep]
}
