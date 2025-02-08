import { Injectable, signal } from '@angular/core'

import { AuthStatus } from '../enums'

@Injectable({ providedIn: 'root' })
export class AuthStatusState {
  readonly status = signal<AuthStatus>(AuthStatus.IDLE)
  readonly error = signal<string | null>(null)

  setLoading() {
    this.status.set(AuthStatus.LOADING)
    this.error.set(null)
  }

  setSuccess() {
    this.status.set(AuthStatus.SUCCESS)
    this.error.set(null)
  }

  setError(message: string) {
    this.status.set(AuthStatus.ERROR)
    this.error.set(message)
  }
}
