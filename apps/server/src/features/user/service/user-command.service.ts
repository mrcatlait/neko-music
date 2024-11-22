import { CreateUserCommand } from '../commands'
import { CreateUserValidator } from '../validators'
import { UserRepository } from '../repositories'
import { User } from '../models'

import { CryptoService } from '@core/services'
import { BadRequestException } from '@common/exceptions'

export class UserCommandService {
  constructor(
    private readonly createUserValidator: CreateUserValidator,
    private readonly cryptoService: CryptoService,
    private readonly userRepository: UserRepository,
  ) {}

  async createUser(command: CreateUserCommand): Promise<User> {
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
