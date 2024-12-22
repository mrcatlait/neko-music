import { ValidationResult } from './validation-result.model'

export interface Validator<T> {
  validate(data: T): Promise<ValidationResult> | ValidationResult
}
