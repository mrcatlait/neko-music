import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'

import { LoginState } from './login.state'

import { SharedModule } from '@shared/shared.module'

@Component({
  standalone: true,
  selector: 'neko-login',
  templateUrl: 'login.component.html',
  styleUrl: 'login.component.scss',
  imports: [SharedModule],
  providers: [LoginState],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly route = inject(ActivatedRoute)
  private readonly state = inject(LoginState)

  hidePassword = true

  readonly invalidCredentials = this.state.invalidCredentials
  readonly loading = this.state.loading

  // readonly selectors = loginSelectors

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  handleSubmit(): void {
    if (this.form.valid) {
      const email = this.form.controls.email.value ?? ''
      const password = this.form.controls.password.value ?? ''

      this.state.login({ email, password })
    } else {
      this.form.markAllAsTouched()
    }
  }
}
