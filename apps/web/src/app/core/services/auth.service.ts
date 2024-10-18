import { inject, Injectable, signal } from '@angular/core'
import { tap } from 'rxjs/operators'
import { firstValueFrom } from 'rxjs'

import { PermissionService } from './permission.service'
import { CookieService } from './cookie.service'

import { WINDOW } from '@core/tokens'
import { AuthRepository } from '@core/repositories'

const IS_AUTHENTICATED_COOKIE_NAME = 'is.authenticated'
const SESSION_CHECK_EXPIRY_DAYS = 1000 * 60 * 60 * 24 * 2

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly window = inject(WINDOW)
  private readonly permissionService = inject(PermissionService)
  private readonly cookieService = inject(CookieService)
  private readonly authRepository = inject(AuthRepository)

  readonly accessToken = signal<string | null>(null)

  // login() {
  // return this.authRepository
  //   .login({ username, password })
  //   .pipe(tap(({ accessToken }) => this.setSession(accessToken)))
  // }

  async logout(): Promise<void> {
    this.removeUserFromCache()
    this.cookieService.delete(IS_AUTHENTICATED_COOKIE_NAME)

    await firstValueFrom(this.authRepository.logout())
  }

  refreshToken() {
    return this.authRepository.refreshToken().pipe(tap(({ accessToken }) => this.setSession(accessToken)))
  }

  async checkSession() {
    if (!this.cookieService.get(IS_AUTHENTICATED_COOKIE_NAME)) {
      // No session
      return
    }

    try {
      await this.getTokenSilently()
    } catch {}
  }

  async getTokenSilently(): Promise<any> {
    const user = this.getUserFromCache()

    if (user) {
      return user
    }

    await this.getTokenUsingRefreshToken()
  }

  // private setSession(accessToken: string): void {
  //   // const decodedToken = this.decodeToken(accessToken)
  //   this.accessToken.set(accessToken)
  //   this.permissionService.setUserPermissions([]) // Get from token
  // }

  // private clearSession(): void {
  //   this.accessToken.set(null)
  //   this.permissionService.setUserPermissions([]) // Set guest preset
  // }

  async getTokenUsingCredentials(payload: { username: string; password: string }) {
    try {
      const tokenResult = await firstValueFrom(this.authRepository.login({ username, password }))

      this.processToken(tokenResult.accessToken)
    } catch {
      this.logout()
    }
  }

  async getTokenUsingRefreshToken() {
    try {
      const tokenResult = await firstValueFrom(this.authRepository.refreshToken())

      this.processToken(tokenResult.accessToken)
    } catch {
      this.logout()
    }
  }

  private processToken(token: string) {
    const decodedToken = this.decodeToken(token)

    this.saveUserInCache(decodedToken)

    this.cookieService.set({
      name: IS_AUTHENTICATED_COOKIE_NAME,
      value: 'true',
      expires: SESSION_CHECK_EXPIRY_DAYS,
    })
  }

  private getUserFromCache() {}

  private saveUserInCache(user: any) {}

  private removeUserFromCache() {}

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
