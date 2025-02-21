import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Observable, shareReplay, tap } from 'rxjs'

import { AuthRepository } from '../repositories'
import { SessionCookieService } from '../services'
import { AuthSessionState } from '../states'

@Injectable({ providedIn: 'root' })
export class LogoutStrategy {
  private readonly router = inject(Router)
  private readonly authRepository = inject(AuthRepository)
  private readonly authSessionState = inject(AuthSessionState)
  private readonly sessionCookieService = inject(SessionCookieService)

  logout(): Observable<void> {
    return this.authRepository.logout().pipe(
      tap(() => {
        this.authSessionState.clearSession()
        this.sessionCookieService.deleteCookie()
        this.router.navigate(['/login'])
      }),
      shareReplay(1),
    )
  }
}
