import { inject, Injectable } from '@angular/core'
import { HttpErrorResponse } from '@angular/common/http'
import { catchError, Observable, of, shareReplay, tap } from 'rxjs'

import { Credentials, Session } from '../interfaces'
import { AuthRepository } from '../repositories'
import { SessionCookieService } from '../services'
import { BaseAuthStrategy } from './base-auth.strategy'
import { AuthSessionState, AuthStatusState } from '../states'

@Injectable({ providedIn: 'root' })
export class CredentialsAuthStrategy extends BaseAuthStrategy {
  private readonly authRepository = inject(AuthRepository)
  private readonly sessionState = inject(AuthSessionState)
  private readonly statusState = inject(AuthStatusState)
  private readonly sessionCookieService = inject(SessionCookieService)

  authenticate(credentials: Credentials): Observable<Session | null> {
    return this.authRepository.login(credentials).pipe(
      tap((session) => {
        this.sessionState.updateSession(session)
        this.sessionCookieService.setCookie()
        this.statusState.setSuccess()
      }),
      catchError((error) => {
        this.sessionState.clearSession()
        this.sessionCookieService.deleteCookie()
        this.statusState.setError(error instanceof HttpErrorResponse ? error.error?.message : 'Authentication failed')
        return of(null)
      }),
      shareReplay(1),
    )
  }
}
