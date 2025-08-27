import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'

import { AuthStore } from '@/core/stores'

export const canActivateWithPermissions =
  (permissions: string[]): CanActivateFn =>
  () => {
    return inject(AuthStore).hasAllPermissions(permissions)
  }
