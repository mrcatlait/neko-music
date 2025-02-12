import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core'
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms'
import { RouterLink } from '@angular/router'
import { AutofocusDirective, ButtonDirective, SelectorDirective, TextfieldDirective } from '@neko/ui-shared/directives'
import { registrationSelectors } from '@neko/ui-selectors'
import { ErrorComponent, TextfieldComponent } from '@neko/ui-shared/components'
import { injectEnvironment, provideValidationErrors } from '@neko/ui-shared/providers'
import { emailValidator } from '@neko/ui-shared/validators'

import { RegistrationState } from './registration.state'

@Component({
  standalone: true,
  selector: 'neko-registration',
  templateUrl: 'registration.component.html',
  styleUrl: 'registration.component.scss',
  imports: [
    ButtonDirective,
    SelectorDirective,
    ReactiveFormsModule,
    TextfieldComponent,
    TextfieldDirective,
    ReactiveFormsModule,
    ErrorComponent,
    RouterLink,
    AutofocusDirective,
  ],
  providers: [
    RegistrationState,
    provideValidationErrors({
      emailTaken: () => 'Email is already taken',
    }),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  private readonly state = inject(RegistrationState)
  private readonly environment = injectEnvironment()

  hidePassword = true

  readonly applicationName = this.environment.applicationName

  readonly loading = this.state.loading

  readonly selectors = registrationSelectors

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, emailValidator]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  constructor() {
    effect(() => {
      this.form.controls.email.addValidators([this.emailTakenValidator.bind(this)])
      this.form.controls.email.updateValueAndValidity()
    })
  }

  handleSubmit(): void {
    if (this.form.valid) {
      const username = this.form.controls.username.value ?? ''
      const email = this.form.controls.email.value ?? ''
      const password = this.form.controls.password.value ?? ''

      this.state.register({ username, email, password })
    } else {
      this.form.markAllAsTouched()
    }
  }

  private emailTakenValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value

    if (this.state.takenEmail() === email) {
      return { emailTaken: true }
    }

    return null
  }
}
