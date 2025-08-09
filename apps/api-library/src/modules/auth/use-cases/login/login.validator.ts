import { Injectable } from '@nestjs/common'
import { hashSync, compareSync } from 'bcrypt'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'
import { ConfigService } from '@/modules/config/services'

export interface LoginValidatorPayload {
  password: string
  passwordHash?: string
}

const INVALID_CREDENTIALS_ERROR = 'Invalid credentials'

@Injectable()
export class LoginValidator implements Validator<LoginValidatorPayload> {
  private readonly saltRounds: number
  private readonly dummyHash: string

  constructor(private readonly configService: ConfigService) {
    this.saltRounds = configService.config.SALT_ROUNDS
    this.dummyHash = hashSync('password', this.saltRounds)
  }

  validate(payload: LoginValidatorPayload): ValidationResult {
    if (!payload.passwordHash) {
      // Use constant-time comparison
      compareSync(payload.password, this.dummyHash)

      return {
        isValid: false,
        errors: [INVALID_CREDENTIALS_ERROR],
      }
    }

    const isValid = compareSync(payload.password, payload.passwordHash)

    return {
      isValid,
      errors: isValid ? [] : [INVALID_CREDENTIALS_ERROR],
    }
  }
}
