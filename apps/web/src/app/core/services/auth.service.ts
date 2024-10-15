import { inject, Injectable, signal } from '@angular/core'
import { tap } from 'rxjs/operators'
import { Observable } from 'rxjs'

import { PermissionService } from './permission.service'

import { WINDOW } from '@core/tokens'
import { AuthRepository } from '@core/repositories'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly window = inject(WINDOW)
  private readonly permissionService = inject(PermissionService)
  private readonly authRepository = inject(AuthRepository)

  readonly accessToken = signal<string | null>(null)

  login(username: string, password: string) {
    return this.authRepository
      .login({ username, password })
      .pipe(tap(({ accessToken }) => this.setSession(accessToken)))
  }

  logout(): Observable<void> {
    return this.authRepository.logout().pipe(
      tap(() => {
        this.clearSession()
      }),
    )
  }

  refreshToken() {
    return this.authRepository.refreshToken().pipe(tap(({ accessToken }) => this.setSession(accessToken)))
  }

  setupAutomaticSilentRefresh(): void {
    this.refreshToken().subscribe({
      error: () => {
        this.accessToken.set(null)
      },
    })
  }

  private setSession(accessToken: string): void {
    const decodedToken = this.decodeToken(accessToken)
    this.accessToken.set(accessToken)
    this.permissionService.setUserPermissions([]) // Get from token
  }

  private clearSession(): void {
    this.accessToken.set(null)
    this.permissionService.setUserPermissions([]) // Set guest preset
  }

  private decodeToken<T>(token?: string): T | null {
    if (!token) {
      return null
    }

    const parts = token.split('.')

    if (parts.length !== 3) {
      throw new Error(
        `The inspected token doesn't appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.`,
      )
    }

    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = decodeURIComponent(
      this.window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    )

    if (!decoded) {
      throw new Error('Cannot decode the token.')
    }

    return JSON.parse(decoded)
  }
}
