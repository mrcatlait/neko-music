import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { AuthState } from '@core/state'
import { ENVIRONMENT } from '@core/tokens'

export const canActivateAuthorized: CanActivateFn = () => {
  const authState = inject(AuthState)
  const router = inject(Router)
  const environment = inject(ENVIRONMENT)

  const isAuthenticated = authState.isAuthenticated()

  if (!isAuthenticated && environment.private) {
    router.navigate(['/login'])
  }

  return isAuthenticated
}
