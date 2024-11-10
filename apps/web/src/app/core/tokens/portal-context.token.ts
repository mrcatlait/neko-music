import { InjectionToken } from '@angular/core'

export interface PortalContext {
  id: string
  data?: Record<string, unknown>
}

export const PORTAL_CONTEXT = new InjectionToken<PortalContext>('PORTAL_CONTEXT')
