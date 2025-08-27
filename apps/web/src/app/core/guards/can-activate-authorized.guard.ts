import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'

import { AuthStore } from '@/core/stores'

export const canActivateAuthorized: CanActivateFn = () => {
  const router = inject(Router)
  const isAuthenticated = inject(AuthStore).isAuthenticated()

  if (!isAuthenticated) {
    router.navigate(['/login'])
  }

  return isAuthenticated
}
