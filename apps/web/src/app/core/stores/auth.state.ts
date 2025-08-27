import { computed, Injectable, signal } from '@angular/core'

import { Session } from '@/shared/interfaces'

@Injectable({ providedIn: 'root' })
export class AuthStore {
  readonly session = signal<Session | null>(null)
  readonly permissions = signal<string[]>([])

  readonly isAuthenticated = computed(() => Boolean(this.session()))

  updateSession(session: Session): void {
    this.session.set(session)
    this.updatePermissionsFromToken(session.permissions)
  }

  clearSession(): void {
    this.session.set(null)
    this.permissions.set([])
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

  private updatePermissionsFromToken(permissions: string[]): void {
    this.permissions.set(permissions)
  }
}
