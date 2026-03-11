import { inject, Injectable } from '@angular/core'
import { catchError, Observable, shareReplay, tap, throwError } from 'rxjs'
import { Router } from '@angular/router'
import { Role, RolePermissions } from '@neko/permissions'

import { AuthStrategy } from './auth.strategy'
import { AuthApi } from '../auth-api'
import { AuthStore } from '../auth-store'
import { Session } from '../session.model'

import { SessionCookie } from '@/core/services'

export interface Credentials {
  email: string
  password: string
}

@Injectable({ providedIn: 'root' })
export class CredentialsAuthStrategy extends AuthStrategy {
  private readonly authApi = inject(AuthApi)
  private readonly authStore = inject(AuthStore)
  private readonly router = inject(Router)
  private readonly sessionCookie = inject(SessionCookie)

  authenticate(credentials: Credentials): Observable<Session | null> {
    return this.authApi.login(credentials).pipe(
      tap((response) => {
        this.authStore.updateSession(response)
        this.authStore.updateAccessToken(response.accessToken)
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
