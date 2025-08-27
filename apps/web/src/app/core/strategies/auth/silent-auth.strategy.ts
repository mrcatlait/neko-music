import { inject, Injectable } from '@angular/core'
import { Observable, of, catchError, shareReplay, tap } from 'rxjs'

import { AuthStrategy } from './auth.strategy'

import { AuthStore } from '@/core/stores'
import { Session } from '@/shared/interfaces'
import { SessionCookie } from '@/core/services'
import { AuthRepository } from '@/core/repositories'

@Injectable({ providedIn: 'root' })
export class SilentAuthStrategy extends AuthStrategy {
  private readonly authRepository = inject(AuthRepository)
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

    return this.authRepository.whoami().pipe(
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
