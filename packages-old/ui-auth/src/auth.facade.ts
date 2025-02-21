import { inject, Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { AuthSessionState, AuthStatusState } from './states'
import { CredentialsAuthStrategy, LogoutStrategy, SilentAuthStrategy } from './strategies'
import { Credentials } from './interfaces'

@Injectable()
export class AuthFacade {
  private readonly sessionState = inject(AuthSessionState)
  private readonly statusState = inject(AuthStatusState)
  private readonly credentialsAuthStrategy = inject(CredentialsAuthStrategy)
  private readonly logoutStrategy = inject(LogoutStrategy)
  private readonly silentAuthStrategy = inject(SilentAuthStrategy)

  readonly session = this.sessionState.session
  readonly isAuthenticated = this.sessionState.isAuthenticated
  readonly status = this.statusState.status
  readonly error = this.statusState.error

  silentLogin(): Observable<boolean> {
    this.statusState.setLoading()

    return this.silentAuthStrategy.authenticate().pipe(map(Boolean))
  }

  login(credentials: Credentials): void {
    this.statusState.setLoading()

    this.credentialsAuthStrategy.authenticate(credentials).subscribe()
  }

  logout(): void {
    this.logoutStrategy.logout().subscribe()
  }
}
