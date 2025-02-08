import { inject } from '@angular/core'
import { CanActivateFn } from '@angular/router'
import { Permission } from '@neko/permissions'

import { AuthSessionState } from '../states'

export const canActivateWithPermissions =
  (permissions: Permission[]): CanActivateFn =>
  () => {
    return inject(AuthSessionState).hasAllPermissions(permissions)
  }
