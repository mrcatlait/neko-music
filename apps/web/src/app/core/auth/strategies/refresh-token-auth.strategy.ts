import { inject, Injectable } from '@angular/core'
import { BehaviorSubject, catchError, filter, finalize, map, Observable, take, throwError } from 'rxjs'

import { AuthApi } from '../auth-api'
import { AuthStore } from '../auth-store'

@Injectable({ providedIn: 'root' })
export class RefreshTokenAuthStrategy {
  private readonly authApi = inject(AuthApi)
  private readonly authStore = inject(AuthStore)

  private isRefreshing = false
  private readonly refreshTokenSubject = new BehaviorSubject<string | null>(null)

  refreshAccessToken(): Observable<string> {
    if (!this.isRefreshing) {
      this.isRefreshing = true
      this.refreshTokenSubject.next(null)

      return this.authApi.refresh().pipe(
        map((response) => {
          this.authStore.updateAccessToken(response.accessToken)
          this.refreshTokenSubject.next(response.accessToken)
          return response.accessToken
        }),
        catchError((refreshError) => {
          this.authStore.logout()
          return throwError(() => refreshError)
        }),
        finalize(() => {
          this.isRefreshing = false
        }),
      )
    }

    return this.refreshTokenSubject.pipe(
      filter((token): token is string => token !== null),
      take(1),
    )
  }
}
