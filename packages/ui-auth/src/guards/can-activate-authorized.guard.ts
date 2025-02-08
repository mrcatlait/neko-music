import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { AuthSessionState } from '../states'

export const canActivateAuthorized: CanActivateFn = () => {
  const router = inject(Router)
  const isAuthenticated = inject(AuthSessionState).isAuthenticated()

  if (!isAuthenticated) {
    router.navigate(['/login'])
  }

  return isAuthenticated
}
