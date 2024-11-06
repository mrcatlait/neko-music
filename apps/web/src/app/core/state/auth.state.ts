import { computed, inject, Injectable, signal } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { Permission } from '@neko/permissions'
import { Router } from '@angular/router'

import { AuthRepository } from '@core/repositories'
import { CookieService } from '@core/services'

const IS_AUTHENTICATED_COOKIE_NAME = 'is.authenticated'
const SESSION_KEY = 'neko.session'
const DAY = 1000 * 60 * 60 * 24
const SESSION_CHECK_EXPIRY_DAYS = DAY * 2

interface Session {
  user: {
    id: string
    username: string
  }
  permissions: Permission[]
}

@Injectable({
  providedIn: 'root',
})
export class AuthState {
  private readonly router = inject(Router)
  private readonly authRepository = inject(AuthRepository)
  private readonly cookieService = inject(CookieService)

  private permissions = new Set<Permission>()

  readonly session = signal<Session | null>(null)
  readonly isAuthenticated = computed(() => Boolean(this.session()))

  login(session: Session) {
    this.setSession(session)
    this.router.navigate(['/'])
  }

  logout() {
    this.removeSessionFromCache()
    this.cookieService.delete(IS_AUTHENTICATED_COOKIE_NAME)
    this.authRepository.logout()
    this.session.set(null)
    this.permissions.clear()
    this.router.navigate(['/login'])
  }

  checkSession() {
    if (!this.cookieService.get(IS_AUTHENTICATED_COOKIE_NAME)) {
      return
    }

    this.getSessionSilently()
  }

  hasPermission(permission: Permission): boolean {
    return this.permissions.has(permission)
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.permissions.has(permission))
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.permissions.has(permission))
  }

  async getSessionSilently() {
    const session = this.getSessionFromCache()

    if (session) {
      this.setSession(session)
      return
    }

    this.getSessionUsingWhoAmI()
  }

  async getSessionUsingWhoAmI() {
    try {
      const session = await firstValueFrom(this.authRepository.whoAmI())
      this.login(session)
    } catch {
      this.logout()
    }
  }

  setSession(session: Session) {
    this.session.set(session)
    this.saveSessionInCache(session)
    this.permissions = new Set(session.permissions)
  }

  getSessionFromCache(): Session | null {
    const session = sessionStorage.getItem(SESSION_KEY)
    return session ? JSON.parse(session) : null
  }

  saveSessionInCache(session: Session): void {
    this.cookieService.set({
      name: IS_AUTHENTICATED_COOKIE_NAME,
      value: 'true',
      secure: true,
      sameSite: 'Strict',
      expires: SESSION_CHECK_EXPIRY_DAYS,
    })

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }

  removeSessionFromCache(): void {
    sessionStorage.removeItem(SESSION_KEY)
  }
}
