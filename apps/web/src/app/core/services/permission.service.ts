import { Injectable } from '@angular/core'

import { Permission } from '@core/enum'

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  private userPermissions = new Set<Permission>()

  setUserPermissions(permissions: Permission[]) {
    this.userPermissions = new Set(permissions)
  }

  hasPermission(permission: Permission): boolean {
    return this.userPermissions.has(permission)
  }

  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some((permission) => this.userPermissions.has(permission))
  }

  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every((permission) => this.userPermissions.has(permission))
  }
}
