import { inject, Injectable } from '@angular/core'
import { Observable, of, catchError, shareReplay, tap } from 'rxjs'

import { Session } from '../models'
import { AuthRepository } from '../repositories'
import { SessionStorageService, SessionCookieService } from '../services'
import { BaseAuthStrategy } from './base-auth.strategy'

@Injectable({ providedIn: 'root' })
export class SilentAuthStrategy extends BaseAuthStrategy {
  private readonly authRepository = inject(AuthRepository)
  private readonly sessionCookieService = inject(SessionCookieService)
  private readonly sessionStorage = inject(SessionStorageService)

  authenticate(): Observable<Session | null> {
    if (!this.sessionCookieService.getCookie()) {
      return of(null)
    }

    const session = this.sessionStorage.get()

    if (session) {
      return of(session)
    }

    return this.authRepository.whoami().pipe(
      tap((response) => {
        this.sessionStorage.set(response)
        this.sessionCookieService.setCookie()
      }),
      catchError(() => {
        this.sessionStorage.remove()
        this.sessionCookieService.deleteCookie()

        return of(null)
      }),
      shareReplay(1),
    )
  }
}
