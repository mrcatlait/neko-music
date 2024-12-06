import { inject, Injectable } from '@angular/core'
import { catchError, map, Observable, of } from 'rxjs'

import { SessionStorageService } from './session-storage.service'
import { SessionCookieService } from './session-cookie.service'
import { Session } from '../models'
import { AuthRepository } from '../repositories'

@Injectable()
export class AuthService {
  private readonly authRepository = inject(AuthRepository)
  private readonly sessionCookieService = inject(SessionCookieService)
  private readonly sessionStorage = inject(SessionStorageService)

  login(session: Session) {
    this.sessionStorage.set(session)
  }

  logout() {
    this.sessionStorage.remove()
    this.sessionCookieService.deleteCookie()
  }

  getSessionSilently(): Observable<Session | null> {
    if (!this.sessionCookieService.getCookie()) {
      return of(null)
    }

    const session = this.sessionStorage.get()

    if (session) {
      return of(session)
    }

    return this.getSessionUsingWhoAmI()
  }

  getSessionUsingWhoAmI(): Observable<Session | null> {
    return this.authRepository.whoAmI().pipe(
      map((session) => {
        this.sessionStorage.set(session)
        this.sessionCookieService.setCookie()
        return session
      }),
      catchError(() => of(null)),
    )
  }
}
