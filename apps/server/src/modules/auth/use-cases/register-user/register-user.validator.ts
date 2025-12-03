import { Injectable } from '@nestjs/common'

import { RegisterUserUseCaseParams } from './register-user.use-case'
import { AuthRepository } from '../../repositories'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

@Injectable()
export class RegisterUserValidator implements Validator<RegisterUserUseCaseParams> {
  constructor(private readonly authRepository: AuthRepository) {}

  async validate(params: RegisterUserUseCaseParams): Promise<ValidationResult> {
    const emailExists = await this.authRepository.accountExistsByEmail(params.email)

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
