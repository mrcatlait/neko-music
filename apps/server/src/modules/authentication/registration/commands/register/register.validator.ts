import { Injectable } from '@nestjs/common'

import { RegisterCommand } from './register.command'
import { UserLoginDataRepository } from '../../../shared/repositories'

import { ValidationResult, Validator } from '@modules/shared/models'

@Injectable()
export class RegisterValidator implements Validator<RegisterCommand> {
  constructor(private readonly userLoginDataRepository: UserLoginDataRepository) {}

  async validate(command: RegisterCommand): Promise<ValidationResult> {
    const [emailExists] = await Promise.all([this.userLoginDataRepository.existsByEmail(command.email)])

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
