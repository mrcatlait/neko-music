import { Injectable } from '@nestjs/common'

import { CreateUserCommand } from './create-user.command'
import { UserRepository } from '../../repositories'

import { ValidationResult, Validator } from '@modules/shared/models'

@Injectable()
export class CreateUserValidator implements Validator<CreateUserCommand> {
  constructor(private readonly userRepository: UserRepository) {}

  async validate(command: CreateUserCommand): Promise<ValidationResult> {
    const [emailExists, usernameExists] = await Promise.all([
      this.userRepository.existsByEmail(command.email),
      this.userRepository.existsByUsername(command.username),
    ])

    const isValid = !emailExists && !usernameExists
    const errors: string[] = []

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
