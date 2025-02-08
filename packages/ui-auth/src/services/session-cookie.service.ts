import { inject, Injectable } from '@angular/core'
import { CookieService } from '@neko/ui-shared/public-api'

@Injectable({ providedIn: 'root' })
export class SessionCookieService {
  private readonly cookieService = inject(CookieService)

  private readonly IS_AUTHENTICATED_COOKIE_NAME = 'is.authenticated'
  private readonly SESSION_CHECK_EXPIRY_DAYS = 2

  setCookie() {
    this.cookieService.set({
      name: this.IS_AUTHENTICATED_COOKIE_NAME,
      value: 'true',
      secure: true,
      sameSite: 'Strict',
      expires: this.SESSION_CHECK_EXPIRY_DAYS,
    })
  }

  deleteCookie() {
    this.cookieService.delete(this.IS_AUTHENTICATED_COOKIE_NAME)
  }

  getCookie() {
    return this.cookieService.get(this.IS_AUTHENTICATED_COOKIE_NAME)
  }
}
