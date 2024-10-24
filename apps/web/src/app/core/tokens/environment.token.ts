import { InjectionToken } from '@angular/core'

import { Environment } from '@core/models'
import { environment } from '@environment'

export const ENVIRONMENT = new InjectionToken<Environment>('environment', {
  providedIn: 'root',
  factory: () => environment,
})
