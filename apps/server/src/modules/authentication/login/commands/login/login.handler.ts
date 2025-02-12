import { Injectable, UnauthorizedException } from '@nestjs/common'

import { LoginValidator } from './login.validator'
import { LoginCommand, LoginCommandResult } from './login.command'
import { UserLoginDataRepository } from '../../../shared/repositories'

import { Handler } from '@modules/shared/models'

@Injectable()
export class LoginHandler implements Handler<LoginCommand, LoginCommandResult> {
  constructor(
    private readonly userLoginDataRepository: UserLoginDataRepository,
    private readonly loginValidator: LoginValidator,
  ) {}

  async handle(command: LoginCommand): Promise<LoginCommandResult> {
    const userLoginData = await this.userLoginDataRepository.findOneByEmail(command.email)

    const validationResult = this.loginValidator.validate({
      password: command.password,
      passwordHash: userLoginData?.password_hash,
    })

    if (!validationResult.isValid || !userLoginData) {
      throw new UnauthorizedException()
    }

    return userLoginData
  }
}
