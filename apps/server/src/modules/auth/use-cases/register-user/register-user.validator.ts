import { BadRequestException, Injectable } from '@nestjs/common'

import { RegisterUserUseCaseParams } from './register-user.use-case'
import { AuthRepository } from '../../repositories'

import { Validator } from '@/modules/shared/interfaces'

@Injectable()
export class RegisterUserValidator implements Validator<RegisterUserUseCaseParams> {
  constructor(private readonly authRepository: AuthRepository) {}

  async validate(params: RegisterUserUseCaseParams): Promise<void> {
    const emailExists = await this.authRepository.accountExistsByEmail(params.email)

    if (emailExists) {
      throw new BadRequestException('emailTaken')
    }
  }
}
