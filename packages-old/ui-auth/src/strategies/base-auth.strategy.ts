import { Observable } from 'rxjs'

import { Session } from '../interfaces'

export abstract class BaseAuthStrategy {
  abstract authenticate(...args: unknown[]): Observable<Session | null>
}
