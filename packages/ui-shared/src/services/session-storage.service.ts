import { Injectable } from '@angular/core'

import { Session } from '../models'

@Injectable()
export class SessionStorageService {
  private session: Session | null = null

  set(session: Session) {
    this.session = session
  }

  get(): Session | null {
    return this.session
  }

  remove() {
    this.session = null
  }
}
