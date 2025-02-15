import { computed, inject, Injectable } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError, map, tap } from 'rxjs/operators'

import { AuthSessionState, AuthStatusState } from './states'
import { CredentialsAuthStrategy, SilentAuthStrategy } from './strategies'
import { Credentials } from './models'

@Injectable()
export class AuthFacade {
  private readonly sessionState = inject(AuthSessionState)
  private readonly statusState = inject(AuthStatusState)
  private readonly credentialsAuthStrategy = inject(CredentialsAuthStrategy)
  private readonly silentAuthStrategy = inject(SilentAuthStrategy)

  readonly isAuthenticated = computed(() => !!this.sessionState.accessToken())
  readonly status = this.statusState.status
  readonly error = this.statusState.error

  silentLogin(): Observable<boolean> {
    return this.silentAuthStrategy.authenticate().pipe(
      tap((session) => {
        if (session) {
          this.sessionState.updateSession(session.accessToken)
          this.statusState.setSuccess()
        } else {
          this.sessionState.clearSession()
        }

        this.sessionState.updateSession('1231')
        this.statusState.setSuccess()
      }),
      map(() => true),
      catchError(() => {
        this.sessionState.clearSession()
        this.statusState.setError('Authentication failed')
        return of(false)
      }),
    )
  }

  login(credentials: Credentials): void {
    this.statusState.setLoading()

    this.credentialsAuthStrategy.authenticate(credentials).subscribe({
      next: (session) => {
        this.sessionState.updateSession(session.accessToken)
        this.statusState.setSuccess()
      },
      error: (error) => {
        this.sessionState.clearSession()
        this.statusState.setError(error instanceof HttpErrorResponse ? error.error?.message : 'Authentication failed')
      },
    })
  }
}
