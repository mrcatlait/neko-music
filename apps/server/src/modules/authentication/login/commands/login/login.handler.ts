import { Injectable, UnauthorizedException } from '@nestjs/common'

import { LoginValidator } from './login.validator'
import { LoginCommand } from './login.command'
import { UserLoginDataRepository } from '../../../shared/repositories'

import { Handler } from '@modules/shared/models'
import { UserLoginDataEntity } from '@modules/authentication/shared/entities'

@Injectable()
export class LoginHandler implements Handler<LoginCommand, UserLoginDataEntity> {
  constructor(
    private readonly userLoginDataRepository: UserLoginDataRepository,
    private readonly loginValidator: LoginValidator,
  ) {}

  async handle(command: LoginCommand): Promise<UserLoginDataEntity> {
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
