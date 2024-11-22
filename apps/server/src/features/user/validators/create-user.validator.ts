import { CreateUserCommand } from '../commands'
import { UserRepository } from '../repositories'

import { ValidationResult, Validator } from '@core/validation'

export class CreateUserValidator implements Validator<CreateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async validate(command: CreateUserCommand): Promise<ValidationResult> {
    const [emailExists, usernameExists] = await Promise.all([
      this.userRepository.existsByEmail(command.email),
      this.userRepository.existsByUsername(command.username),
    ])

    const isValid = !emailExists && !usernameExists
    const errors = []

    if (emailExists) {
      errors.push('emailTaken')
    }

    if (usernameExists) {
      errors.push('usernameTaken')
    }

    return {
      isValid,
      errors,
    }
  }
}
