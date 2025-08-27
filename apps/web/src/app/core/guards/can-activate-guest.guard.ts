import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { AuthStore } from '@/core/stores'

export const canActivateGuest: CanActivateFn = () => {
  const router = inject(Router)
  const isAuthenticated = inject(AuthStore).isAuthenticated()

  if (isAuthenticated) {
    router.navigate(['/'])
  }

  return !isAuthenticated
}
