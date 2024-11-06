import { Injectable, inject, signal } from '@angular/core'
import { take } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'

import { StateModel } from '@core/models'
import { AuthRepository } from '@core/repositories'
import { AuthState } from '@core/state'

export interface RegistrationStateModel {
  loading: boolean
  emailTaken: boolean
  usernameTaken: boolean
}

@Injectable()
export class RegistrationState implements StateModel<RegistrationStateModel> {
  private readonly repository = inject(AuthRepository)
  private readonly authState = inject(AuthState)

  readonly loading = signal(false)
  readonly emailTaken = signal(false)
  readonly usernameTaken = signal(false)

  register(payload: { username: string; email: string; password: string }) {
    this.loading.set(true)
    this.emailTaken.set(false)
    this.usernameTaken.set(false)

    this.repository
      .register(payload)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.loading.set(false)
          this.authState.login(response)
        },
        error: (error) => {
          this.handleError({ error })
        },
      })
  }

  private handleError(payload: { error: Error }) {
    this.loading.set(false)

    if (payload.error instanceof HttpErrorResponse) {
      const httpError = payload.error

      if (httpError.status !== 400 || !httpError.error) {
        return
      }

      const { emailTaken, usernameTaken } = httpError.error

      this.emailTaken.set(emailTaken)
      this.usernameTaken.set(usernameTaken)
    }
  }
}
