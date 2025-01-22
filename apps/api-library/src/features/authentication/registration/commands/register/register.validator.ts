import { RegisterCommand } from './register.command'

import { UserLoginDataRepository } from '@features/authentication/shared/repositories/user-login-data.repository'
import { ValidationResult, Validator } from '@common/models'
import { Container } from '@common/di'

export class RegisterValidator implements Validator<RegisterCommand> {
  private readonly userLoginDataRepository: UserLoginDataRepository

  constructor() {
    this.userLoginDataRepository = Container.get(UserLoginDataRepository)
  }

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
