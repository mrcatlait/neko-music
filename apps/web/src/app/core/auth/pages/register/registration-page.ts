import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { HttpErrorResponse } from '@angular/common/http'
import { Contracts } from '@neko/contracts'
import {
  form,
  email as emailValidator,
  minLength,
  required,
  FormField,
  disabled,
  pattern,
} from '@angular/forms/signals'

import { AuthApi } from '../../auth-api'
import { RegistrationAuthStrategy } from '../../strategies'
import { AuthStore } from '../../auth-store'

import { Button, IconButton, LoadingIndicator, Textfield } from '@/shared/components'
import { SessionCookie } from '@/core/services'

interface RegistrationModel {
  email: string
  password: string
  displayName: string
}

@Component({
  selector: 'n-registration-page',
  imports: [Button, IconButton, FormField, LoadingIndicator, RouterLink, Textfield],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPage {
  private readonly authApi = inject(AuthApi)
  private readonly authStore = inject(AuthStore)
  private readonly registrationAuthStrategy = inject(RegistrationAuthStrategy)
  private readonly sessionCookie = inject(SessionCookie)

  private readonly registrationModel = signal<RegistrationModel>({
    email: '',
    password: '',
    displayName: '',
  })
  protected readonly registrationForm = form(this.registrationModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' })
    emailValidator(schemaPath.email, { message: 'Email must be in the format name&#64;example.com' })
    required(schemaPath.password, { message: 'required' })
    minLength(schemaPath.password, 8, { message: 'minlength' })
    pattern(schemaPath.password, /[^a-zA-Z]/, { message: 'pattern' })
    required(schemaPath.displayName, { message: 'Display name is required' })
    disabled(schemaPath, () => this.loading())
  })

  protected readonly hidePassword = signal(true)
  protected readonly loading = signal(false)
  protected readonly lastEmail = signal('')
  protected readonly emailTaken = signal(false)

  togglePassword(): void {
    this.hidePassword.update((hide) => !hide)
  }

  register(event: Event): void {
    event.preventDefault()

    if (this.registrationForm().invalid()) {
      this.registrationForm.email().markAsTouched()
      this.registrationForm.password().markAsTouched()
      this.registrationForm.displayName().markAsTouched()

      return
    }

    const credentials = this.registrationModel()

    this.loading.set(true)
    this.lastEmail.set(credentials.email)
    this.emailTaken.set(false)

    this.authApi.register(credentials).subscribe({
      next: (response) => {
        this.loading.set(false)
        this.registrationAuthStrategy.authenticate({ accessToken: response.accessToken, session: response })
      },
      error: (payload) => {
        this.loading.set(false)
        this.handleError(payload)
      },
    })
  }

  private handleError(payload: Error) {
    this.loading.set(false)

    if (payload instanceof HttpErrorResponse) {
      if (payload.status === 400 && payload.error) {
        const error = payload.error as Contracts.Error.BadRequest
        this.emailTaken.set(error.message.includes('emailTaken'))
        return
      }
      this.authStore.clearSession()
      this.sessionCookie.delete()
    }
  }
}
