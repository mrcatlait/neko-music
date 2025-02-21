import { Injectable } from '@nestjs/common'

import { RegisterUserCommand } from './register-user.command'

import { UserLoginDataRepository } from '@modules/authentication/repositories'
import { ValidationResult, Validator } from '@modules/shared/models'

@Injectable()
export class RegisterUserValidator implements Validator<RegisterUserCommand> {
  constructor(private readonly userLoginDataRepository: UserLoginDataRepository) {}

  async validate(command: RegisterUserCommand): Promise<ValidationResult> {
    const emailExists = await this.userLoginDataRepository.existsByEmail(command.email)

    const isValid = !emailExists
    const errors: string[] = []

    if (emailExists) {
      errors.push('emailTaken')
    }

    return {
      isValid,
      errors,
    }
  }
}
