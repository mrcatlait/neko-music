import { ValidatorFn } from '@angular/forms'

export const emailValidator: ValidatorFn = (control) => {
  if (control.value) {
    const matches = control.value.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)

    return matches ? null : { email: true }
  }

  return null
}
