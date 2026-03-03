import { inject, Injectable } from '@angular/core'
import { Observable, of, catchError, shareReplay, tap } from 'rxjs'

import { AuthStrategy } from './auth.strategy'
import { AuthApi } from '../auth-api'
import { AuthStore } from '../auth-store'
import { Session } from '../session.model'

import { SessionCookie } from '@/core/services'

@Injectable({ providedIn: 'root' })
export class SilentAuthStrategy extends AuthStrategy {
  private readonly authApi = inject(AuthApi)
  private readonly sessionCookie = inject(SessionCookie)
  private readonly authStore = inject(AuthStore)

  authenticate(): Observable<Session | null> {
    if (!this.sessionCookie.get()) {
      this.authStore.clearSession()
      return of(null)
    }

    const session = this.authStore.session()

    if (session) {
      return of(session)
    }

    return this.authApi.whoami().pipe(
      tap((response) => {
        this.authStore.updateSession(response)
        this.sessionCookie.set()
      }),
      catchError(() => {
        this.authStore.clearSession()
        this.sessionCookie.delete()

        return of(null)
      }),
      shareReplay(1),
    )
  }
}
