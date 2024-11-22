import { Validator, ValidationResult } from '../models'

export class StringLengthValidator implements Validator<string> {
  constructor(
    private readonly fieldName: string,
    private readonly min: number,
    private readonly max: number,
  ) {}

  validate(value: string): ValidationResult {
    const isValid = value.length >= this.min && value.length <= this.max

    return {
      isValid,
      errors: isValid ? [] : [`${this.fieldName} must be between ${this.min} and ${this.max} characters`],
    }
  }
}
