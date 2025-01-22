import { RegisterCommand, RegisterCommandResult } from './register.command'
import { RegisterValidator } from './register.validator'

import { UserLoginDataRepository } from '@features/authentication/shared/repositories'
import { Handler } from '@common/models/handler.model'
import { Container } from '@common/di'
import { GetDefaultRoleQuery } from '@features/authorization/queries'
import { TokenService } from '@features/authentication/shared/services'

export class BadRequestError extends Error {
  code = 'BAD_REQUEST'
  status = 400

  constructor(message: string) {
    super(message)
  }
}

export class RegisterHandler implements Handler<RegisterCommand, RegisterCommandResult> {
  private readonly userLoginDataRepository: UserLoginDataRepository
  private readonly getDefaultRoleQuery: GetDefaultRoleQuery
  private readonly registerValidator: RegisterValidator
  private readonly tokenService: TokenService

  constructor() {
    this.userLoginDataRepository = Container.get(UserLoginDataRepository)
    this.getDefaultRoleQuery = Container.get(GetDefaultRoleQuery)
    this.registerValidator = Container.get(RegisterValidator)
    this.tokenService = Container.get(TokenService)
  }

  async handle(command: RegisterCommand): Promise<RegisterCommandResult> {
    const validationResult = await this.registerValidator.validate(command)

    if (!validationResult.isValid) {
      throw new BadRequestError(validationResult.errors)
    }

    const role = await this.getDefaultRoleQuery.handle()

    const passwordHash = Bun.password.hashSync(command.password)

    const user = await this.userLoginDataRepository.create({
      email: command.email,
      password_hash: passwordHash,
      role_id: role.id,
    })

    return this.tokenService.createTokenPair(user.user_id)
  }
}
