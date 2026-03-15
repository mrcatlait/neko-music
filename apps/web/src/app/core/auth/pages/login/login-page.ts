import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { take } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'
import { RouterLink } from '@angular/router'
import { disabled, email as emailValidator, form, FormField, minLength, required } from '@angular/forms/signals'

import { CredentialsAuthStrategy } from '../../strategies'

import { Button, IconButton, LoadingIndicator, Textfield } from '@/shared/components'
import { Snackbar } from '@/shared/snackbar'

interface LoginModel {
  email: string
  password: string
}

@Component({
  selector: 'n-login-page',
  imports: [Button, IconButton, FormField, LoadingIndicator, Textfield, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  private readonly snackbar = inject(Snackbar)
  private readonly credentialsAuthStrategy = inject(CredentialsAuthStrategy)

  private readonly loginModel = signal<LoginModel>({
    email: '',
    password: '',
  })
  protected readonly loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' })
    emailValidator(schemaPath.email, { message: 'Email must be in the format name&#64;example.com' })
    required(schemaPath.password, { message: 'Password is required' })
    minLength(schemaPath.password, 8, { message: 'Password must be at least 8 characters long' })
    disabled(schemaPath, () => this.loading())
  })

  protected readonly loading = signal(false)
  protected readonly invalidCredentials = signal(false)

  protected hidePassword = true

  login(event: Event): void {
    event.preventDefault()

    if (this.loginForm().invalid()) {
      this.loginForm.email().markAsTouched()
      this.loginForm.password().markAsTouched()

      return
    }

    const credentials = this.loginModel()

    this.loading.set(true)
    this.invalidCredentials.set(false)

    this.credentialsAuthStrategy
      .authenticate(credentials)
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
      } else {
        this.snackbar.info('An error occurred while logging in')
      }
    }
  }
}
