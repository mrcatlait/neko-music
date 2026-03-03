import { inject } from '@angular/core'
import { CanActivateFn, RedirectCommand, Router } from '@angular/router'

import { AuthStore } from '../auth-store'

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router)
  const isAuthenticated = inject(AuthStore).isAuthenticated()

  if (isAuthenticated) {
    const homePath = router.parseUrl('/')

    return new RedirectCommand(homePath, {
      skipLocationChange: true,
    })
  }

  return true
}
