import { inject, Injectable } from '@angular/core'
import { catchError, Observable, shareReplay, tap, throwError } from 'rxjs'
import { Router } from '@angular/router'

import { AuthStrategy } from './auth.strategy'

import { AuthStore } from '@/core/stores'
import { Session } from '@/shared/interfaces'
import { SessionCookie } from '@/core/services'
import { AuthRepository } from '@/core/repositories'

export interface Credentials {
  email: string
  password: string
}

@Injectable({ providedIn: 'root' })
export class CredentialsAuthStrategy extends AuthStrategy {
  private readonly authRepository = inject(AuthRepository)
  private readonly authStore = inject(AuthStore)
  private readonly router = inject(Router)
  private readonly sessionCookie = inject(SessionCookie)

  authenticate(credentials: Credentials): Observable<Session | null> {
    return this.authRepository.login(credentials).pipe(
      tap((session) => {
        this.authStore.updateSession(session)
        this.authStore.updateAccessToken(session.accessToken)
        this.sessionCookie.set()
        this.router.navigate(['/'])
      }),
      catchError((error) => {
        this.authStore.clearSession()
        this.sessionCookie.delete()
        return throwError(() => error)
      }),
      shareReplay(1),
    )
  }
}
