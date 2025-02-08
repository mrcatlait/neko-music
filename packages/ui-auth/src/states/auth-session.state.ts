import { computed, Injectable, signal } from '@angular/core'
import { Permission } from '@neko/permissions'


@Injectable({ providedIn: 'root' })
export class AuthSessionState {
  readonly accessToken = signal<string | null>(null)
  readonly permissions = signal<string[]>([])

  readonly isAuthenticated = computed(() => Boolean(this.accessToken()))

  updateSession(accessToken: string): void {
    this.accessToken.set(accessToken)
    this.updatePermissionsFromToken(accessToken)
  }

  clearSession(): void {
    this.accessToken.set(null)
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

  private updatePermissionsFromToken(token: string): void {
    this.permissions.set(token.split(',') || [])
  }
}
