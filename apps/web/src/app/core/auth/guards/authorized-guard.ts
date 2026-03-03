import { inject } from '@angular/core'
import { CanActivateFn, RedirectCommand, Router } from '@angular/router'

import { AuthStore } from '../auth-store'

export const authorizedGuard: CanActivateFn = () => {
  const router = inject(Router)
  const isAuthenticated = inject(AuthStore).isAuthenticated()

  if (!isAuthenticated) {
    const loginPath = router.parseUrl('/login')

    return new RedirectCommand(loginPath, {
      skipLocationChange: true,
    })
  }

  return true
}
