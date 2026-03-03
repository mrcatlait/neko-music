import { Observable } from 'rxjs'

import { Session } from '../session.model'

export abstract class AuthStrategy {
  abstract authenticate(...args: unknown[]): Observable<Session | null>
}
