import { Injectable } from '@nestjs/common'

import { AuthService } from '../../services'

import { ValidationResult, Validator } from '@/modules/shared/interfaces'

export interface LoginValidatorPayload {
  password: string
  passwordHash?: string
}

const INVALID_CREDENTIALS_ERROR = 'Invalid credentials'

@Injectable()
export class LoginValidator implements Validator<LoginValidatorPayload> {
  private readonly dummyHash: string

  constructor(private readonly authService: AuthService) {
    this.dummyHash = authService.generatePasswordHash('password', authService.generatePasswordSalt())
  }

  validate(payload: LoginValidatorPayload): ValidationResult {
    if (!payload.passwordHash) {
      // Use constant-time comparison
      this.authService.comparePasswordHash(payload.password, this.dummyHash)

      return {
        isValid: false,
        errors: [INVALID_CREDENTIALS_ERROR],
      }
    }

    const isValid = this.authService.comparePasswordHash(payload.password, payload.passwordHash)

    return {
      isValid,
      errors: isValid ? [] : [INVALID_CREDENTIALS_ERROR],
    }
  }
}
