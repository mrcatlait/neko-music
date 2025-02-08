import { Injectable, inject, signal } from '@angular/core'
import { take } from 'rxjs'
import { HttpErrorResponse } from '@angular/common/http'

import { StateModel } from '@core/models'
import { AuthState } from '@core/state'
import { AuthRepository } from '@core/repositories'

export interface LoginStateModel {
  loading: boolean
  invalidCredentials: boolean
}

@Injectable()
export class LoginState implements StateModel<LoginStateModel> {
  private readonly authRepository = inject(AuthRepository)
  private readonly authState = inject(AuthState)

  readonly loading = signal(false)
  readonly invalidCredentials = signal(false)

  login(payload: { email: string; password: string }): void {
    this.loading.set(true)
    this.invalidCredentials.set(false)

    this.authRepository
      .login(payload)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          this.loading.set(false)
          this.authState.login(response)
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
