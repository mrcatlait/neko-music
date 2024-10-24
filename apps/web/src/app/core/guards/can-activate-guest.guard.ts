import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { AuthState } from '@core/state'

export const canActivateGuest: CanActivateFn = () => {
  const authState = inject(AuthState)

  const router = inject(Router)

  const isAuthenticated = authState.isAuthenticated()

  if (isAuthenticated) {
    router.navigate(['/'])
  }

  return !isAuthenticated
}
