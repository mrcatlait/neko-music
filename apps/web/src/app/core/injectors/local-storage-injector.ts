import { inject, InjectionToken } from '@angular/core'

import { WINDOW } from './window-injector'

export const LOCAL_STORAGE = new InjectionToken<Storage>('LOCAL_STORAGE', {
  factory: () => inject(WINDOW).localStorage,
})
