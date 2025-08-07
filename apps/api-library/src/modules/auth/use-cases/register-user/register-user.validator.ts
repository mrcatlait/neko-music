import { Injectable } from '@nestjs/common'

import { RegisterUserUseCaseParams } from './register-user.use-case'
import { UserAccountRepository } from '../../repositories'

import { ValidationResult, Validator } from '@/modules/shared/models'

@Injectable()
export class RegisterUserValidator implements Validator<RegisterUserUseCaseParams> {
  constructor(private readonly userAccountRepository: UserAccountRepository) {}

  async validate(params: RegisterUserUseCaseParams): Promise<ValidationResult> {
    const emailExists = await this.userAccountRepository.existsByEmail(params.email)

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
