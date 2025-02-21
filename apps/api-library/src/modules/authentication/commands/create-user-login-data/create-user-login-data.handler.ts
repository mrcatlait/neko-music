import { ConfigService } from '@nestjs/config'
import { hashSync } from 'bcrypt'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { CreateUserLoginDataCommand } from './create-user-login-data.command'

import { UserLoginDataRepository } from '@modules/authentication/repositories'
import { EnvironmentVariables } from '@modules/shared/models'

@CommandHandler(CreateUserLoginDataCommand)
export class CreateUserLoginDataHandler implements ICommandHandler<CreateUserLoginDataCommand> {
  private readonly saltRounds: number

  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
    private readonly userLoginDataRepository: UserLoginDataRepository,
  ) {
    this.saltRounds = configService.get('SALT_ROUNDS')
  }

  async execute(command: CreateUserLoginDataCommand): Promise<{ user_id: string }> {
    const passwordHash = hashSync(command.password, this.saltRounds)

    return this.userLoginDataRepository.create({
      email: command.email,
      password_hash: passwordHash,
    })
  }
}
