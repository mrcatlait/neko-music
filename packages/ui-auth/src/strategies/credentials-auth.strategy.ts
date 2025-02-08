import { inject, Injectable } from '@angular/core'
import { Observable, shareReplay, tap } from 'rxjs'

import { Credentials, Session } from '../models'
import { AuthRepository } from '../repositories'
import { SessionCookieService, SessionStorageService } from '../services'
import { BaseAuthStrategy } from './base-auth.strategy'

@Injectable({ providedIn: 'root' })
export class CredentialsAuthStrategy extends BaseAuthStrategy {
  private readonly authRepository = inject(AuthRepository)
  private readonly sessionStorage = inject(SessionStorageService)
  private readonly sessionCookieService = inject(SessionCookieService)

  authenticate(credentials: Credentials): Observable<Session> {
    return this.authRepository.login(credentials).pipe(
      tap((session) => {
        this.sessionStorage.set(session)
        this.sessionCookieService.setCookie()
      }),
      shareReplay(1),
    )
  }
}
