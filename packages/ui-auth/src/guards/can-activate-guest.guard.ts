import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { AuthSessionState } from '../states'

export const canActivateGuest: CanActivateFn = () => {
  const router = inject(Router)
  const isAuthenticated = inject(AuthSessionState).isAuthenticated()

  if (isAuthenticated) {
    router.navigate(['/'])
  }

  return !isAuthenticated
}
