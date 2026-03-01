import { inject, Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'
import { Router } from '@angular/router'

import { AuthStrategy } from './auth.strategy'

import { AuthStore } from '@/core/stores'
import { Session } from '@/shared/interfaces'
import { SessionCookie } from '@/core/services'

interface RegistrationResult {
  accessToken: string
  session: Session
}

@Injectable({ providedIn: 'root' })
export class RegistrationAuthStrategy extends AuthStrategy {
  private readonly authStore = inject(AuthStore)
  private readonly router = inject(Router)
  private readonly sessionCookie = inject(SessionCookie)

  authenticate(result: RegistrationResult): Observable<Session | null> {
    this.authStore.updateSession(result.session)
    this.authStore.updateAccessToken(result.accessToken)
    this.sessionCookie.set()
    this.router.navigate(['/'])

    return of(result.session)
  }
}
