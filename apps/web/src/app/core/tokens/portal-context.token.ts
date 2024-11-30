import { inject, InjectionToken } from '@angular/core'

export interface PortalContext<T> {
  id: string
  data?: T
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PORTAL_CONTEXT = new InjectionToken<PortalContext<any>>('PORTAL_CONTEXT')

export const injectPortalContext = <T = void>(): PortalContext<T> => inject(PORTAL_CONTEXT)
