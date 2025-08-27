import { inject, Injectable } from '@angular/core'

import { Cookie } from './cookie'

@Injectable({ providedIn: 'root' })
export class SessionCookie {
  private readonly cookie = inject(Cookie)

  private readonly isAuthenticatedCookieName = 'is.authenticated'
  private readonly sessionCheckExpiryDays = 2

  set() {
    this.cookie.set({
      name: this.isAuthenticatedCookieName,
      value: 'true',
      secure: true,
      sameSite: 'Strict',
      expires: this.sessionCheckExpiryDays,
    })
  }

  delete() {
    this.cookie.delete(this.isAuthenticatedCookieName)
  }

  get() {
    return this.cookie.get(this.isAuthenticatedCookieName)
  }
}
