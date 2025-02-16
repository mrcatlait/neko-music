import { BadRequestException, Injectable } from '@nestjs/common'
import { hashSync } from 'bcrypt'
import { ConfigService } from '@nestjs/config'

import { RegisterValidator } from './register.validator'
import { RegisterCommand, RegisterCommandResult } from './register.command'
import { UserLoginDataRepository } from '../../../shared/repositories'

import { EnvironmentVariables, Handler } from '@modules/shared/models'
import { GetDefaultRoleHandler } from '@modules/authorization/roles/queries'
import { CreateAccountHandler } from '@modules/user/account/commands'
import { AssignRoleHandler } from '@modules/authorization/roles/commands'

@Injectable()
export class RegisterHandler implements Handler<RegisterCommand, RegisterCommandResult> {
  private readonly saltRounds: number

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly userLoginDataRepository: UserLoginDataRepository,
    private readonly getDefaultRoleHandler: GetDefaultRoleHandler,
    private readonly registerValidator: RegisterValidator,
    private readonly createAccountHandler: CreateAccountHandler,
    private readonly assignRoleHandler: AssignRoleHandler,
  ) {
    this.saltRounds = configService.get('SALT_ROUNDS')
  }

  async handle(command: RegisterCommand): Promise<RegisterCommandResult> {
    const validationResult = await this.registerValidator.validate(command)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const passwordHash = hashSync(command.password, this.saltRounds)

    const userLoginData = await this.userLoginDataRepository.create({
      email: command.email,
      password_hash: passwordHash,
    })

    const role = await this.getDefaultRoleHandler.handle()

    await Promise.all([
      this.createAccountHandler.handle({
        userId: userLoginData.user_id,
        displayName: command.displayName,
      }),
      this.assignRoleHandler.handle({ userId: userLoginData.user_id, roleId: role.id }),
    ])

    return
  }
}
