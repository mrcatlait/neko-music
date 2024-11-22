import { Validator, ValidationResult } from './models'

export class ValidationAggregator<T> {
  constructor(private readonly validators: Validator<T>[]) {}

  async validate(data: T): Promise<ValidationResult> {
    const results = await Promise.all(this.validators.map((validator) => validator.validate(data)))

    return {
      isValid: results.every((r) => r.isValid),
      errors: results.flatMap((r) => r.errors),
    }
  }
}
