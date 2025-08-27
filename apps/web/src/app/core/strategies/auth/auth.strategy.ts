import { Observable } from 'rxjs'

import { Session } from '@/shared/interfaces'

export abstract class AuthStrategy {
  abstract authenticate(...args: unknown[]): Observable<Session | null>
}
