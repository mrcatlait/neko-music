import { inject, Injectable } from '@angular/core'
import { Observable, of, catchError, shareReplay, tap } from 'rxjs'

import { Session } from '../interfaces'
import { AuthRepository } from '../repositories'
import { SessionCookieService } from '../services'
import { BaseAuthStrategy } from './base-auth.strategy'
import { AuthSessionState, AuthStatusState } from '../states'

@Injectable({ providedIn: 'root' })
export class SilentAuthStrategy extends BaseAuthStrategy {
  private readonly authRepository = inject(AuthRepository)
  private readonly sessionCookieService = inject(SessionCookieService)
  private readonly sessionState = inject(AuthSessionState)
  private readonly statusState = inject(AuthStatusState)

  authenticate(): Observable<Session | null> {
    if (!this.sessionCookieService.getCookie()) {
      this.sessionState.clearSession()
      this.statusState.setSuccess()
      return of(null)
    }

    const session = this.sessionState.session()

    if (session) {
      return of(session)
    }

    return this.authRepository.whoami().pipe(
      tap((response) => {
        this.sessionState.updateSession(response)
        this.sessionCookieService.setCookie()
        this.statusState.setSuccess()
      }),
      catchError(() => {
        this.sessionState.clearSession()
        this.sessionCookieService.deleteCookie()
        this.statusState.setError('Authentication failed')

        return of(null)
      }),
      shareReplay(1),
    )
  }
}
