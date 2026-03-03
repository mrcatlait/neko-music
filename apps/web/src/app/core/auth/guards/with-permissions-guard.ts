import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'

import { AuthStore } from '../auth-store'

export const withPermissionsGuard =
  (permissions: string[]): CanActivateFn =>
  () => {
    return inject(AuthStore).hasAllPermissions(permissions)
  }
