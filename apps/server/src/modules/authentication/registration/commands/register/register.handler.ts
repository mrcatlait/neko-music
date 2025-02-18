import { BadRequestException, Injectable } from '@nestjs/common'

import { RegisterValidator } from './register.validator'
import { RegisterCommand, RegisterCommandResult } from './register.command'

import { Handler } from '@modules/shared/models'
import { RegisterSaga } from '../../sagas'

@Injectable()
export class RegisterHandler implements Handler<RegisterCommand, RegisterCommandResult> {
  constructor(
    private readonly registerValidator: RegisterValidator,
    private readonly registerSaga: RegisterSaga,
  ) {}

  async handle(command: RegisterCommand): Promise<RegisterCommandResult> {
    const validationResult = await this.registerValidator.validate(command)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    await this.registerSaga.execute({
      email: command.email,
      password: command.password,
      displayName: command.displayName,
    })
  }
}
