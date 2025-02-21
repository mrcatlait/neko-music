import { UnauthorizedException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { LoginValidator } from './login.validator'
import { LoginCommand } from './login.command'

import { UserLoginDataEntity } from '@modules/authentication/entities'
import { UserLoginDataRepository } from '@modules/authentication/repositories'

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly userLoginDataRepository: UserLoginDataRepository,
    private readonly loginValidator: LoginValidator,
  ) {}

  async execute(command: LoginCommand): Promise<UserLoginDataEntity> {
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
