import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { registrationSelectors } from '@neko/ui-test/selectors'

import { RegistrationState } from './registration.state'

import { ENVIRONMENT } from '@core/tokens'
import { SelectorDirective, TextfieldDirective } from '@shared/directives'
import { TextfieldComponent } from '@shared/components'

@Component({
  standalone: true,
  selector: 'neko-registration',
  templateUrl: 'registration.component.html',
  styleUrl: 'registration.component.scss',
  imports: [SelectorDirective, ReactiveFormsModule, TextfieldComponent, TextfieldDirective],
  providers: [RegistrationState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  private readonly environment = inject(ENVIRONMENT)
  private readonly state = inject(RegistrationState)

  hidePassword = true

  readonly applicationName = this.environment.applicationName

  readonly loading = this.state.loading
  readonly emailTaken = this.state.emailTaken
  readonly usernameTaken = this.state.usernameTaken

  readonly selectors = registrationSelectors

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  })

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

  private emailValidator(control: AbstractControl) {
    if (control.value) {
      const matches = control.value.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)

      return matches ? null : { email: true }
    }

    return null
  }
}
