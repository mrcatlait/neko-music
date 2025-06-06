import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { loginSelectors } from '@neko/ui-test/selectors'

import { LoginState } from './login.state'

import { ENVIRONMENT } from '@core/tokens'
import { ErrorComponent, TextfieldComponent } from '@shared/components'
import { SelectorDirective, TextfieldDirective } from '@shared/directives'

@Component({
  standalone: true,
  selector: 'neko-login',
  templateUrl: 'login.component.html',
  styleUrl: 'login.component.scss',
  imports: [SelectorDirective, ReactiveFormsModule, TextfieldComponent, TextfieldDirective, ErrorComponent],
  providers: [LoginState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly state = inject(LoginState)
  private readonly environment = inject(ENVIRONMENT)

  hidePassword = true

  readonly invalidCredentials = this.state.invalidCredentials
  readonly loading = this.state.loading
  readonly applicationName = this.environment.applicationName

  readonly selectors = loginSelectors

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const email = this.form.controls.email.value ?? ''
    const password = this.form.controls.password.value ?? ''

    this.state.login({ email, password })
  }
}
