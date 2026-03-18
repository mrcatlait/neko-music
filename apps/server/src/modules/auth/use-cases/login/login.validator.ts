import { Injectable, UnauthorizedException } from '@nestjs/common'

import { AuthService } from '../../services'

import { Validator } from '@/modules/shared/interfaces'

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

  validate(payload: LoginValidatorPayload): void {
    if (!payload.passwordHash) {
      // Use constant-time comparison
      this.authService.comparePasswordHash(payload.password, this.dummyHash)

      throw new UnauthorizedException(INVALID_CREDENTIALS_ERROR)
    }

    const isValidPassword = this.authService.comparePasswordHash(payload.password, payload.passwordHash)

    if (!isValidPassword) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_ERROR)
    }
  }
}
