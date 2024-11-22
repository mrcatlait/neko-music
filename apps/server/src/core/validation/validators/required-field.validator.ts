import { Validator, ValidationResult } from '../models'

export class RequiredFieldValidator implements Validator<unknown> {
  constructor(private readonly fieldName: string) {}

  validate(data: unknown): ValidationResult {
    const isValid = data !== null && data !== undefined && data !== ''

    return {
      isValid,
      errors: isValid ? [] : [`${this.fieldName} is required`],
    }
  }
}
