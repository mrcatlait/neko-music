import { Observable } from 'rxjs'

import { Session } from '../models'

export abstract class BaseAuthStrategy {
  abstract authenticate(...args: unknown[]): Observable<Session | null>
}
