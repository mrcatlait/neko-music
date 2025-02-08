import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'
import { Permission } from '@neko/permissions'

import { AuthState } from '@core/state'

export const canActivateWithPermissions =
  (permissions: Permission[]): CanActivateFn =>
  () => {
    const authState = inject(AuthState)

    return authState.hasAllPermissions(permissions)
  }
