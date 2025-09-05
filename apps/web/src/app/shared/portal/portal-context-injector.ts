import { InjectionToken } from '@angular/core'

import { PortalContext } from './portal-context'

export const PORTAL_CONTEXT = new InjectionToken<PortalContext<unknown>>('PORTAL_CONTEXT')
