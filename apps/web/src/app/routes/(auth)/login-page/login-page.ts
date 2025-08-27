import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { take } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { RouterLink } from '@angular/router'

import { CredentialsAuthStrategy } from '@/core/strategies'
import { emailValidator } from '@/shared/validators'
import { Textfield } from '@/shared/components'
import { Button } from '@/shared/directives'

@Component({
  selector: 'n-login-page',
  imports: [Button, ReactiveFormsModule, Textfield, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly credentialsAuthStrategy = inject(CredentialsAuthStrategy)

  protected readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, emailValidator]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  })

  protected readonly loading = signal(false)
  protected readonly invalidCredentials = signal(false)

  protected hidePassword = true

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const email = this.form.controls.email.value ?? ''
    const password = this.form.controls.password.value ?? ''

    this.loading.set(true)
    this.invalidCredentials.set(false)

    this.credentialsAuthStrategy
      .authenticate({ email, password })
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.loading.set(false)
        },
        error: (error) => this.handleError({ error }),
      })
  }

  private handleError(payload: { error: Error }): void {
    this.loading.set(false)

    if (payload.error instanceof HttpErrorResponse) {
      if (payload.error.status === 401) {
        this.invalidCredentials.set(true)
      }
    }
  }
}
