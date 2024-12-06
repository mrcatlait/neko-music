import { inject, Injectable } from '@angular/core'

import { Session } from '../models'
import { WINDOW } from '../tokens'

@Injectable()
export class SessionStorageService {
  private readonly window = inject(WINDOW)

  private readonly SESSION_KEY = 'neko.session'

  set(session: Session) {
    this.window.sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
  }

  get(): Session | null {
    const session = this.window.sessionStorage.getItem(this.SESSION_KEY)
    return session ? JSON.parse(session) : null
  }

  remove() {
    this.window.sessionStorage.removeItem(this.SESSION_KEY)
  }
}
