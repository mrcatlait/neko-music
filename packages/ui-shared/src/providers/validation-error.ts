import { InjectionToken } from '@angular/core'

type errorMessageFn = (options: { fieldName: string; value: unknown; requiredLength?: number; min?: number }) => string

const defaultValidationErrors: Record<string, errorMessageFn> = {
  required: () => `Field is required`,
  email: () => `Field must be in the format name@example.com`,
  pattern: () => `Field has invalid format`,
  minlength: ({ requiredLength }) => `Field must be at least ${requiredLength} characters long`,
  min: ({ min }) => `Field must be greater than or equal to ${min}`,
}

export const VALIDATION_ERRORS = new InjectionToken('VALIDATION_ERRORS', {
  providedIn: 'root',
  factory: () => defaultValidationErrors,
})

export const provideValidationErrors = (validationErrors: Record<string, errorMessageFn>) => {
  return {
    provide: VALIDATION_ERRORS,
    useValue: {
      ...defaultValidationErrors,
      ...validationErrors,
    },
  }
}
