import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { HttpErrorResponse } from '@angular/common/http'
import { Contracts } from '@neko/contracts'

import { Button } from '@/shared/directives'
import { LoadingIndicator, Textfield } from '@/shared/components'
import { emailValidator } from '@/shared/validators'
import { AuthRepository } from '@/core/repositories'
import { AuthStore } from '@/core/stores'
import { SessionCookie } from '@/core/services'

@Component({
  selector: 'n-registration-page',
  imports: [Button, LoadingIndicator, ReactiveFormsModule, RouterLink, Textfield],
  templateUrl: './registration-page.html',
  styleUrl: './registration-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPage {
  private readonly authRepository = inject(AuthRepository)
  private readonly authStore = inject(AuthStore)
  private readonly sessionCookie = inject(SessionCookie)

  protected readonly form = new FormGroup({
    email: new FormControl('', [Validators.required, emailValidator]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/[^a-zA-Z]/)]),
    displayName: new FormControl('', [Validators.required]),
  })

  protected readonly hidePassword = signal(true)
  protected readonly loading = signal(false)
  protected readonly lastEmail = signal('')
  protected readonly emailTaken = signal(false)

  constructor() {
    this.handleLoading()
  }

  togglePassword(): void {
    this.hidePassword.update((hide) => !hide)
  }

  register(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const email = this.form.controls.email.value ?? ''
    const password = this.form.controls.password.value ?? ''
    const displayName = this.form.controls.displayName.value ?? ''

    this.loading.set(true)
    this.lastEmail.set(email)
    this.emailTaken.set(false)

    this.authRepository.register({ email, password, displayName }).subscribe({
      next: (response) => {
        this.loading.set(false)
        this.authStore.updateSession(response)
        this.authStore.updateAccessToken(response.accessToken)
        this.sessionCookie.set()
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
      if (payload.status !== 400 || !payload.error) {
        return
      }

      const error = payload.error as Contracts.Error.BadRequest

      this.emailTaken.set(error.message.includes('emailTaken'))
    }
  }

  private handleLoading() {
    effect(() => {
      if (this.loading()) {
        this.form.disable()
      } else {
        this.form.enable()
      }
    })
  }
}
