export interface ValidationResultSuccess {
  isValid: true
}

export interface ValidationResultFailure {
  isValid: false
  error?: string
}

export type ValidationResult = ValidationResultSuccess | ValidationResultFailure

export interface Validator<T> {
  validate(data: T): Promise<ValidationResult> | ValidationResult
}
