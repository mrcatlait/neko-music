import { inject, InjectionToken } from '@angular/core'

import { WINDOW } from './window-injector'

export const CRYPTO = new InjectionToken<Crypto>('CRYPTO', {
  factory: () => inject(WINDOW).crypto,
})
