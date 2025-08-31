import { computed, inject, Injectable, signal } from '@angular/core'
import { Router } from '@angular/router'

import { Session } from '@/shared/interfaces'

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private readonly router = inject(Router)

  readonly session = signal<Session | null>(null)

  readonly accessToken = signal<string | null>(null)

  readonly permissions = computed(() => this.session()?.permissions ?? [])

  readonly isAuthenticated = computed(() => Boolean(this.session()))

  updateSession(session: Session): void {
    this.session.set(session)
  }

  clearSession(): void {
    this.session.set(null)
  }

  updateAccessToken(accessToken: string): void {
    this.accessToken.set(accessToken)
  }

  logout(): void {
    this.session.set(null)
    this.accessToken.set(null)
    this.router.navigate(['/login'])
  }

  hasPermission(permission: string): boolean {
    return this.permissions().includes(permission)
  }

  hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.permissions().includes(permission))
  }

  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((permission) => this.permissions().includes(permission))
  }
}
