import { ValidationResult, Validator } from '@common/models'

interface LoginValidatorPayload {
  password: string
  passwordHash?: string
}

export class LoginValidator implements Validator<LoginValidatorPayload> {
  private readonly dummyHash = Bun.password.hashSync('password')

  validate(payload: LoginValidatorPayload): ValidationResult {
    if (!payload.passwordHash) {
      // Use constant-time comparison
      Bun.password.verifySync(payload.password, this.dummyHash)

      return {
        isValid: false,
        errors: [],
      }
    }

    const isValid = Bun.password.verifySync(payload.password, payload.passwordHash)

    return {
      isValid,
      errors: [],
    }
  }
}
