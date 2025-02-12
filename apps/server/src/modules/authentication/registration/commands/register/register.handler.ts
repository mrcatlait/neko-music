import { BadRequestException, Injectable } from '@nestjs/common'
import { hashSync } from 'bcrypt'
import { ConfigService } from '@nestjs/config'

import { RegisterValidator } from './register.validator'
import { RegisterCommand, RegisterCommandResult } from './register.command'
import { UserLoginDataRepository } from '../../../shared/repositories'

import { EnvironmentVariables, Handler } from '@modules/shared/models'
import { GetDefaultRoleHandler } from '@modules/authorization/roles/queries'

@Injectable()
export class RegisterHandler implements Handler<RegisterCommand, RegisterCommandResult> {
  private readonly saltRounds: number

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly userLoginDataRepository: UserLoginDataRepository,
    private readonly getDefaultRoleHandler: GetDefaultRoleHandler,
    private readonly registerValidator: RegisterValidator,
  ) {
    this.saltRounds = configService.get('SALT_ROUNDS')
  }

  async handle(command: RegisterCommand): Promise<RegisterCommandResult> {
    const validationResult = await this.registerValidator.validate(command)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const role = await this.getDefaultRoleHandler.handle()

    const passwordHash = hashSync(command.password, this.saltRounds)

    await this.userLoginDataRepository.create({
      email: command.email,
      password_hash: passwordHash,
      role_id: role.id,
    })

    return
  }
}
