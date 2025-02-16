import { computed, Injectable, signal } from '@angular/core'
import { Permission } from '@neko/permissions'

import { Session } from '../interfaces'

@Injectable({ providedIn: 'root' })
export class AuthSessionState {
  readonly session = signal<Session | null>(null)
  readonly permissions = signal<Permission[]>([])

  readonly isAuthenticated = computed(() => Boolean(this.session()))

  updateSession(session: Session): void {
    this.session.set(session)
    this.updatePermissionsFromToken(session.permissions)
  }

  clearSession(): void {
    this.session.set(null)
    this.permissions.set([])
  }

  hasPermission(permission: Permission): boolean {
    return this.permissions().includes(permission)
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.permissions().includes(permission))
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.permissions().includes(permission))
  }

  private updatePermissionsFromToken(permissions: Permission[]): void {
    this.permissions.set(permissions)
  }
}
