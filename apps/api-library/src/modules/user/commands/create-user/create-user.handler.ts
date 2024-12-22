import { BadRequestException, Injectable } from '@nestjs/common'

import { CreateUserCommand } from './create-user.command'
import { UserRepository } from '../../repositories'
import { CreateUserValidator } from './create-user.validator'

import { CommandHandler } from '@modules/shared/models'
import { User } from '@modules/user/models'
import { CryptoService } from '@modules/shared/services'

@Injectable()
export class CreateUserHandler implements CommandHandler<CreateUserCommand, User> {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly createUserValidator: CreateUserValidator,
    private readonly cryptoService: CryptoService,
  ) {}

  async handle(command: CreateUserCommand): Promise<User> {
    const validationResult = await this.createUserValidator.validate(command)

    if (!validationResult.isValid) {
      throw new BadRequestException(validationResult.errors)
    }

    const passwordHash = this.cryptoService.generateHash(command.password)

    const user = await this.userRepository.create({
      username: command.username,
      email: command.email,
      password_hash: passwordHash,
      role_id: command.roleId,
    })

    return this.userRepository.getByIdOrFail(user.id)
  }
}
