import { LoginCommand, LoginCommandResult } from './login.command'
import { LoginValidator } from './login.validator'

import { Handler } from '@common/models'
import { Container } from '@common/di'
import { UserLoginDataRepository } from '@features/authentication/shared/repositories'
import { TokenService } from '@features/authentication/shared/services'

export class UnauthorizedError extends Error {
  code = 'UNAUTHORIZED'
  status = 401

  constructor(message?: string) {
    super(message ?? 'UNAUTHORIZED')
  }
}

export class LoginHandler implements Handler<LoginCommand, LoginCommandResult> {
  private readonly userLoginDataRepository: UserLoginDataRepository
  private readonly loginValidator: LoginValidator
  private readonly tokenService: TokenService

  constructor() {
    this.userLoginDataRepository = Container.get(UserLoginDataRepository)
    this.loginValidator = Container.get(LoginValidator)
    this.tokenService = Container.get(TokenService)
  }

  async handle(command: LoginCommand): Promise<LoginCommandResult> {
    const userLoginData = await this.userLoginDataRepository.findOneByEmail(command.email)

    const validationResult = this.loginValidator.validate({
      password: command.password,
      passwordHash: userLoginData?.password_hash,
    })

    if (!validationResult.isValid || !userLoginData) {
      throw new UnauthorizedError()
    }

    return this.tokenService.createTokenPair(userLoginData.user_id)
  }
}
