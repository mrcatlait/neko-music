import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, catchError, finalize, map, Observable, of, shareReplay } from 'rxjs'

import { SessionStorageService } from './session-storage.service'
import { SessionCookieService } from './session-cookie.service'
import { Session } from '../models'
import { AuthRepository } from '../repositories'

@Injectable()
export class AuthService {
  private readonly authRepository = inject(AuthRepository)
  private readonly sessionCookieService = inject(SessionCookieService)
  private readonly sessionStorage = inject(SessionStorageService)

  private refreshInProgress: boolean = false
  private readonly refreshSessionSubject = new BehaviorSubject<Session | null>(null)
  private readonly refreshSession$ = this.refreshSessionSubject.asObservable()

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

    return this.refreshSession()
  }

  refreshSession(): Observable<Session | null> {
    if (this.refreshInProgress) {
      return this.refreshSession$
    }

    this.refreshInProgress = true
    this.refreshSessionSubject.next(null)

    this.authRepository.refreshToken().pipe(
      map((session) => {
        this.sessionStorage.set(session)
        this.sessionCookieService.setCookie()

        return session
      }),
      finalize(() => {
        this.refreshInProgress = false
      }),
      catchError(() => of(null)),
      shareReplay(1),
    )

    return this.refreshSession$
  }
}
